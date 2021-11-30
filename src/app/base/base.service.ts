import { BadRequestException } from '@nestjs/common'
import { Repository, FindManyOptions, EntityManager } from 'typeorm'
import { Pager } from './pager'
import { ApplicationEntity } from '../../db/entity/application.entity'
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel'

type TransactionProcedure<E> = (manager: EntityManager) => Promise<E>
const isTest = process.env.NODE_ENV === 'test'

export abstract class BaseService<E extends ApplicationEntity<E>> {
  /**
   * https://typeorm.io/#/repository-api
   */
  protected readonly repository: Repository<E>
  private readonly type: new (attributes?: Partial<E>) => E
  constructor(repository: Repository<E>, type: new (attributes?: Partial<E>) => E) {
    this.repository = repository
    this.type = type
  }

  /**
   *
   * @param pager
   * @param options https://typeorm.io/#/find-options
   */
  async searchWithPager(pager: Pager, options?: FindManyOptions<E>): Promise<[E[], Pager]> {
    options = { ...options, ...pager.toFindManyOptions() }
    const collectionWithCount = await this.repository.findAndCount(options)
    pager.totalCount = collectionWithCount[1]
    return [collectionWithCount[0], pager]
  }

  /**
   *
   * @param dto
   * @param options { validate: boolean }
   */
  async create(dto: Partial<E>): Promise<E> {
    if (dto.id) throw new BadRequestException('exist id in body')
    const record = new this.type(dto)
    return record.save()
  }

  /**
   * Entityを差分更新します. 差分がなければupdateしません
   * @param id
   * @param dto
   */
  async update(id: number, dto: Partial<E>): Promise<E> {
    if (!id || (dto.id && dto.id !== id))
      throw new BadRequestException(
        `Not match id and updating data. id: ${id}(${typeof id}), dto.id: ${dto.id}(${typeof dto.id})`
      )
    const record = await this.repository.findOne(id)
    Object.assign(record, dto, { id })
    return record.save()
  }

  /**
   *
   * @param id
   */
  async delete(id: number): Promise<E> {
    const record = await this.repository.findOne(id)
    return await record.remove()
  }

  transaction(procedure: TransactionProcedure<E>): Promise<E>
  transaction(isolationLevel: IsolationLevel, procedure: TransactionProcedure<E>): Promise<E>
  async transaction(one: IsolationLevel | TransactionProcedure<E>, two?: TransactionProcedure<E>): Promise<E> {
    const procedure: TransactionProcedure<E> =
      typeof two === 'function' ? two : typeof one === 'function' ? one : undefined
    if (!procedure) throw new Error()
    const isolationLevel: IsolationLevel = typeof one === 'string' ? one : undefined
    // NOTE: sqliteは、'SERIALIZABLE'と'READ UNCOMMITTED'のみ未対応のため、test環境ではSERIALIZABLEに
    if (isTest || isolationLevel) {
      // NOTE: EntityManager経由で処理をし同一Transactionにできれば良いが、(ex. ContentHistoriesService#create)
      // しかし、そのためにも呼び出し先の別ServiceにentityManagerを渡す必要が在る。record.save()なども別transactionで扱われる。
      // そのため、性能は低いが'SERIALIZABLE'で処理させている。
      return this.repository.manager.transaction('SERIALIZABLE', procedure)
    } else {
      return this.repository.manager.transaction(isolationLevel, procedure)
    }
  }
}

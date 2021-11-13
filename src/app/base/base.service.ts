import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Repository, FindManyOptions, SelectQueryBuilder, EntityManager, FindConditions } from 'typeorm'
import { Pager } from './pager'
import { validate } from 'class-validator'
import { ApplicationEntity } from '../../db/entity/application.entity'
import { ValidationsError } from '../../exception/validations.error'
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel'

type TransactionProcedure<E> = (manager: EntityManager) => Promise<E>

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
   * FindManyOptionの仕様外の事をしたいケースに使う.
   * TypeScriptのcompileや補完が使えないから可能な限り使わない
   * https://typeorm.io/#/select-query-builder
   * orderByでjoin先の指定. groupBy, subqueryなど
   * @param alias
   */
  createQueryBuilder(alias: string): SelectQueryBuilder<E> {
    return this.repository.createQueryBuilder(alias)
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
   * @param options https://typeorm.io/#/find-options
   */
  async search(options?: FindManyOptions<E>): Promise<E[]> {
    const collection = await this.repository.find(options)
    return collection
  }

  /**
   * validate entity
   * @param record
   */
  async validate(record: Partial<E>): Promise<void> {
    const errors = await validate(record)
    if (errors && errors.length > 0) throw new ValidationsError(errors)
  }

  /**
   *
   * @param dto
   * @param options { validate: boolean }
   */
  async create(dto: Partial<E>, options = { validate: true }): Promise<E> {
    if (dto.id) throw new BadRequestException('exist id in body')
    const record = new this.type(dto)
    if (options['validate']) await this.validate(record)
    return record.save()
  }

  /**
   * Entityを差分更新します. 差分がなければupdateしません
   * @param id
   * @param dto
   */
  async update(id: number, dto: Partial<E>, options = { validate: false, notFoundReject: false }): Promise<E> {
    if (!id || (dto.id && dto.id !== id))
      throw new BadRequestException(
        `Not match id and updating data. id: ${id}(${typeof id}), dto.id: ${dto.id}(${typeof dto.id})`
      )
    const record = await this.fetch(id, options)
    Object.assign(record, dto, { id })
    if (options['validate']) await this.validate(record)
    return record.save()
  }

  /**
   *
   * @param id
   */
  async delete(id: number): Promise<E> {
    const record = await this.fetch(id)
    return await record.remove()
  }

  /**
   *
   * @param condition https://typeorm.io/#/find-options
   * @returns
   */
  async deleteBy(condition: FindConditions<E>): Promise<number | null> {
    const result = await this.repository.delete(condition)
    return result.affected
  }

  /**
   *
   * @param id
   */
  async fetch(id: number, options = { notFoundReject: false }): Promise<E> {
    const record = await this.repository.findOne(id)
    if (record) return record

    const err = new NotFoundException(`No exists. id: ${id}`)
    if (options['notFoundReject']) return Promise.reject(err)
    throw err
  }

  transaction(procedure: TransactionProcedure<E>): Promise<E>
  transaction(isolationLevel: IsolationLevel, procedure: TransactionProcedure<E>): Promise<E>
  async transaction(one: IsolationLevel | TransactionProcedure<E>, two?: TransactionProcedure<E>): Promise<E> {
    const procedure: TransactionProcedure<E> =
      typeof two === 'function' ? two : typeof one === 'function' ? one : undefined
    if (!procedure) throw new Error()
    const isolationLevel: IsolationLevel = typeof one === 'string' ? one : undefined
    if (isolationLevel) return this.repository.manager.transaction(isolationLevel, procedure)
    // HACK: EntityManager経由で処理をし同一Transactionにできれば良いが、そのためにも呼び出し先にentityManagerを渡す必要が在る。またrecord.save()なども別transactionで扱われる。そのため、性能は低いが'SERIALIZABLE'で処理させている。
    return this.repository.manager.transaction('SERIALIZABLE', procedure)
  }
}

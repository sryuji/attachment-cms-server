import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Repository, FindManyOptions } from 'typeorm'
import { ApplicationBaseEntity } from '@/src/db/entity/application-base.entity'
import { BaseDto } from './base.dto'
import { Pager } from './pager'

export abstract class BaseService<E extends ApplicationBaseEntity<E>, D extends BaseDto> {
  /**
   * https://typeorm.io/#/repository-api
   */
  protected readonly basicRepository: Repository<E>
  private readonly type: new (attributes?: D) => E
  constructor(repository: Repository<E>, type: new (attributes?: D) => E) {
    this.basicRepository = repository
    this.type = type
  }

  /**
   *
   * @param pager
   * @param options https://typeorm.io/#/find-options
   */
  async searchWithPager(pager: Pager, options?: FindManyOptions<E>): Promise<[E[], Pager]> {
    options = { ...options, ...pager.toFindManyOptions() }
    const collectionWithCount = await this.basicRepository.findAndCount(options)
    pager.totalCount = collectionWithCount[1]
    return [collectionWithCount[0], pager]
  }

  /**
   *
   * @param options https://typeorm.io/#/find-options
   */
  async search(options?: FindManyOptions<E>): Promise<E[]> {
    const collection = await this.basicRepository.find(options)
    return collection
  }

  /**
   *
   * @param id
   */
  async fetch(id: number): Promise<E> {
    const record = await this.basicRepository.findOne(id)
    if (!record) throw new NotFoundException(`No exists. id: ${id}`)
    return record
  }

  /**
   *
   * @param dto
   */
  async create(dto: D): Promise<E> {
    if (dto.id) throw new BadRequestException('Exist id in body')
    const record = new this.type(dto)
    return record.save()
  }

  /**
   * Entityを差分更新します. 差分がなければupdateしません
   * @param id
   * @param dto
   */
  async update(id: number, dto: D): Promise<E> {
    if (!id || dto.id !== id)
      throw new BadRequestException(
        `Not match id and updating data. id: ${id}(${typeof id}), dto.id: ${dto.id}(${typeof dto.id})`,
      )
    const record = await this.findOne(id)
    Object.assign(record, dto)
    return record.save()
  }

  /**
   *
   * @param id
   */
  async delete(id: number): Promise<void> {
    const record = await this.findOne(id)
    await record.remove()
  }

  /**
   *
   * @param id
   */
  private async findOne(id: number): Promise<E> {
    const record = await this.basicRepository.findOne(id)
    if (!record) throw new NotFoundException(`No exists. id: ${id}`)
    return record
  }
}

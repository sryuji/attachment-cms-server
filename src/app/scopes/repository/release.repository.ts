import { Release } from '../../../db/entity/release.entity'
import { Repository, EntityRepository } from 'typeorm'
import { Pager } from '../../base/pager'

@EntityRepository(Release)
export class ReleaseRepository extends Repository<Release> {
  async findLatestRelease(scopeId: number): Promise<Release> {
    return this.createQueryBuilder('release').where({ scopeId }).orderBy('releasedAt', 'DESC', 'NULLS FIRST').getOne()
  }

  async findAll(scopeId: number, page: number, per: number): Promise<[Release[], Pager]> {
    const pager = new Pager({ page, per })
    const [releases, count] = await Release.createQueryBuilder()
      .where({ scopeId })
      .take(pager.per)
      .skip(pager.offset)
      .orderBy('releasedAt', 'DESC', 'NULLS FIRST')
      .getManyAndCount()
    pager.totalCount = count
    return [releases, pager]
  }

  async findOneWithPager(id: number): Promise<[Release, Pager]> {
    const release = await Release.findOne(id)
    const dataList = await Release.createQueryBuilder()
      .select('id')
      .where({ scopeId: release.scopeId })
      .orderBy('releasedAt', 'DESC', 'NULLS FIRST')
      .getRawMany()
    const ids = dataList.map((v) => v['id'])
    const offset = ids.findIndex((id) => id === release.id)
    const totalCount = ids.length
    const pager = new Pager({ page: offset + 1, per: 1, totalCount })
    return [release, pager]
  }
}

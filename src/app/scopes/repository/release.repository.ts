import { Release } from '../../../db/entity/release.entity'
import { Repository, EntityRepository, IsNull, Not } from 'typeorm'
import { Pager } from '../../base/pager'

@EntityRepository(Release)
export class ReleaseRepository extends Repository<Release> {
  async findLatestRelease(scopeId: number, onlyReleased = false): Promise<Release> {
    const releasedCond = onlyReleased ? { releasedAt: Not(IsNull()) } : {}
    return this.createQueryBuilder('release')
      .where({ scopeId, ...releasedCond })
      .orderBy('release.releasedAt', 'DESC', 'NULLS FIRST')
      .getOne()
  }

  async findAll(scopeId: number, page: number, per: number): Promise<[Release[], Pager]> {
    const pager = new Pager({ page, per })
    const [releases, count] = await Release.createQueryBuilder()
      .where({ scopeId })
      .take(pager.per)
      .skip(pager.offset)
      .orderBy('Release.releasedAt', 'DESC', 'NULLS FIRST')
      .getManyAndCount()
    pager.totalCount = count
    return [releases, pager]
  }

  async findOneWithPager(id: number): Promise<[Release, Pager]> {
    const release = await Release.findOne(id)
    const dataList = await Release.createQueryBuilder()
      .select('id')
      .where({ scopeId: release.scopeId })
      .orderBy('Release.releasedAt', 'DESC', 'NULLS FIRST')
      .getRawMany()
    const ids = dataList.map((v) => v['id'])
    const offset = ids.findIndex((id) => id === release.id)
    const totalCount = ids.length
    const pager = new Pager({ page: offset + 1, per: 1, totalCount })
    return [release, pager]
  }
}

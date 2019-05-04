import { Release } from '../../../db/entity/release.entity'
import { Repository, EntityRepository, IsNull, Not } from 'typeorm'

@EntityRepository(Release)
export class ReleaseRepository extends Repository<Release> {
  async findLatestRelease(scopeId: number): Promise<Release> {
    return this.createQueryBuilder('release')
      .where({ scopeId: scopeId, releasedAt: Not(IsNull()) })
      .orderBy({ releasedAt: 'DESC' })
      .getOne()
  }
}

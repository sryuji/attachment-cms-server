import { Repository, EntityRepository, Like } from 'typeorm'
import { Scope } from '../../../db/entity/scope.entity'
import { Pager } from '../../base/pager'

@EntityRepository(Scope)
export class ScopeRepository extends Repository<Scope> {
  async findAll(scopeIds: number[], domain: string, page: number, per: number): Promise<[Scope[], Pager]> {
    const pager = new Pager({ page, per })
    const [scopes, totalCount] = await this.createQueryBuilder('scope')
      .where({ id: scopeIds })
      .where(domain ? [{ domain: Like(`%${domain}%`) }] : {})
      .orderBy('scope.id', 'ASC')
      .skip(pager.offset)
      .take(pager.per)
      .getManyAndCount()
    pager.totalCount = totalCount
    return [scopes, pager]
  }
}

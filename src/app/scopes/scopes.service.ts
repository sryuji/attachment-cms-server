import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Scope } from '../../db/entity/scope.entity'
import { BaseService } from '../base/base.service'
import { ReleaseRepository } from './repository/release.repository'

@Injectable()
export class ScopesService extends BaseService<Scope> {
  constructor(
    @InjectRepository(Scope)
    protected readonly repository: Repository<Scope>,
    @InjectRepository(AccountScope)
    private readonly accountScopeRepository: Repository<AccountScope>,
    private readonly releaseRepository: ReleaseRepository
  ) {
    super(repository, Scope)
  }

  async createWithAccountId(dto: Partial<Scope>, accountId: number): Promise<Scope> {
    return this.transaction(async (manager) => {
      const record = await super.create(dto)
      await this.releaseRepository.insert({ scopeId: record.id })
      await this.accountScopeRepository.insert({ accountId, scopeId: record.id })
      return record
    })
  }
}

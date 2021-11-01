import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Scope } from '../../db/entity/scope.entity'
import { BaseService } from '../base/base.service'
import { ScopeRepository } from './repository/scope.repository'

@Injectable()
export class ScopesService extends BaseService<Scope> {
  constructor(
    protected readonly repository: ScopeRepository,
    @InjectRepository(AccountScope)
    private readonly accountScopeRepository: Repository<AccountScope>
  ) {
    super(repository, Scope)
  }

  async createWithAccountId(dto: Partial<Scope>, accountId: number): Promise<Scope> {
    return this.transaction(async (manager) => {
      const record = await super.create(dto)
      await this.accountScopeRepository.insert({ accountId, scopeId: record.id })
      return record
    })
  }
}

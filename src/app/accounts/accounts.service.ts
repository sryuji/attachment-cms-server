import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { Account } from '../..//db/entity/account.entity'
import { AccountScope } from '../../db/entity/account-scope.entity'

@Injectable()
export class AccountsService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    protected readonly repository: Repository<Account>,
    @InjectRepository(AccountScope)
    protected readonly accountScopeRpository: Repository<AccountScope>
  ) {
    super(repository, Account)
  }

  async delete(id: number): Promise<Account> {
    const record = await this.fetch(id)
    return this.transaction(async (manager) => {
      this.accountScopeRpository.delete({ accountId: record.id })
      return await record.remove()
    })
  }
}

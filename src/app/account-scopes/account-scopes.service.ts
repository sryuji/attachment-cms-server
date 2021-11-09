import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import { ValidationsError } from '../../exception/validations.error'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { BaseService } from '../base/base.service'
import { AccountScopeDto } from './dto/account-scope.dto'

@Injectable()
export class AccountScopesService extends BaseService<AccountScope> {
  constructor(
    @InjectRepository(AccountScope)
    protected readonly repository: Repository<AccountScope>
  ) {
    super(repository, AccountScope)
  }

  async create(dto: Partial<AccountScopeDto>): Promise<AccountScope> {
    const account = await Account.findOne({ where: { email: dto.email } })
    if (!account) throw new ValidationsError(['指定のEメールのアカウントは存在しません。'])
    dto.accountId = account.id
    return super.create(dto)
  }

  async authorize(user: AuthUserDto, scopeId: number): Promise<void> {
    const scopeIds = user.accountScopes && user.accountScopes.map((accountScope) => accountScope.scopeId)
    if (scopeIds && scopeIds.includes(scopeId)) return
    const accountScope = await this.repository.findOne({ where: { accountId: user.sub, scopeId } })
    if (!accountScope) throw new ForbiddenException(`No Permission this scope. scopeId: ${scopeId}`)
    return
  }
}

import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import { RoleType } from '../../enum/role.enum'
import { ValidationsError } from '../../exception/validations.error'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { BaseService } from '../base/base.service'
import { AccountScopeDto } from './dto/account-scope.dto'
import { UpdateAccountScopeDto } from './dto/update-account-scope.dto'

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
    dto.role = 'member'
    return super.create(dto)
  }

  async update(id: number, dto: UpdateAccountScopeDto): Promise<AccountScope> {
    return this.transaction(async (manager) => {
      const record = await super.update(id, dto)
      const count = await AccountScope.count({ where: { scopeId: record.scopeId, role: 'owner' } })
      if (count === 0) {
        throw new ValidationsError(['一人はowner権限を持つメンバーが必要です。'])
      }
      return record
    })
  }

  async authorizeScope(user: AuthUserDto, scopeId: number): Promise<Partial<AccountScope>> {
    if (!user || !scopeId) throw new ForbiddenException()
    let accountScope = user.accountScopes && user.accountScopes.find((r) => r.scopeId === scopeId)
    if (accountScope) return accountScope

    accountScope = await this.repository.findOne({ where: { accountId: user.sub, scopeId } })
    if (!accountScope) throw new ForbiddenException(`No Permission this scope. scopeId: ${scopeId}`)
    return accountScope
  }

  authorizeRole(accountScope: Partial<AccountScope>, permittedRoles: RoleType[]): void {
    if (!permittedRoles || permittedRoles.length === 0) return
    if (!accountScope) throw new ForbiddenException()

    const accountScopeRole: string = accountScope.role
    if (!permittedRoles.find((role) => accountScopeRole === role.toString())) {
      throw new ForbiddenException(`Need role.`)
    }
  }
}

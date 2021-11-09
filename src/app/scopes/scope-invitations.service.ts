import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Account } from '../../db/entity/account.entity'
import { ScopeInvitation } from '../../db/entity/scope-invitation.entity'
import { AccountScopesService } from '../account-scopes/account-scopes.service'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { BaseService } from '../base/base.service'

@Injectable()
export class ScopeInvitationsService extends BaseService<ScopeInvitation> {
  constructor(
    @InjectRepository(ScopeInvitation)
    protected readonly repository: Repository<ScopeInvitation>,
    protected readonly accountScopesService: AccountScopesService
  ) {
    super(repository, ScopeInvitation)
  }

  async create(dto: Partial<ScopeInvitation>): Promise<ScopeInvitation> {
    const record = await super.create(dto)
    // TODO: kick email
    return record
  }

  async join(token: string, user: AuthUserDto) {
    const record = await ScopeInvitation.findOne({ where: { token } })
    record.invitationToken = null
    record.joinedAt = new Date()
    const account = await Account.findOneOrFail(user.sub)

    return this.transaction(async (manager) => {
      await this.accountScopesService.create({ email: account.email, scopeId: record.scopeId })
      return await record.save()
    })
  }
}

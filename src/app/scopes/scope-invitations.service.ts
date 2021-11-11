import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { INVITATION_MAIL_SUBJECT, INVITATION_MAIL_TEXT, NO_REPLY_FROM } from '../../constant/mail.constant'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import { ScopeInvitation } from '../../db/entity/scope-invitation.entity'
import { sendMail } from '../../util/mail'
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
    // NOTE: 非同期
    sendMail({
      to: record.email,
      from: NO_REPLY_FROM,
      subject: INVITATION_MAIL_SUBJECT,
      text: INVITATION_MAIL_TEXT(record.email, record.invitationToken),
    })
    return record
  }

  async join(token: string, user: AuthUserDto) {
    const record = await ScopeInvitation.findOneOrFail({ where: { invitationToken: token } })
    const account = await Account.findOneOrFail(user.sub)
    const accountScope = await AccountScope.findOne({ where: { accountId: account.id, scopeId: record.scopeId } })
    if (accountScope) return record.remove()

    return this.transaction(async (manager) => {
      await this.accountScopesService.create({ email: account.email, scopeId: record.scopeId })
      return record.remove()
    })
  }
}

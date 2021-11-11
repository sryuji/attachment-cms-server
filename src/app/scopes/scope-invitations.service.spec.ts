import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import { ScopeInvitationsService } from './scope-invitations.service'
import { ScopeInvitation } from '../../db/entity/scope-invitation.entity'
import { Account } from '../../db/entity/account.entity'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { AccountScopesService } from '../account-scopes/account-scopes.service'
import { AuthUserDto } from '../auth/dto/auth-user.dto'

jest.mock('@sendgrid/mail')

describe('ScopeInvitationsService', () => {
  let service: ScopeInvitationsService

  beforeAll(async () => {
    const app = await compileModule(
      [Account, AccountScope, ScopeInvitation],
      [ScopeInvitationsService, AccountScopesService]
    )
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed)

    service = app.get<ScopeInvitationsService>(ScopeInvitationsService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#create', () => {
    afterEach(async () => {
      ScopeInvitation.delete({})
    })
    it('creates invitation and send mail', async () => {
      const [scopeId, email] = [1, 'test@com']
      const record = await service.create({ scopeId, email })
      expect(typeof record.id).toBe('number')
      expect(record.email).toEqual(email)
      expect(record.scopeId).toEqual(scopeId)
    })
  })

  describe('#join', () => {
    describe('join new project', () => {
      let invitation: ScopeInvitation

      beforeEach(async () => {
        const [scopeId, email] = [1, 'test@com']
        invitation = await service.create({ scopeId, email })
      })

      afterEach(async () => {
        ScopeInvitation.delete({})
      })

      it('joins Project', async () => {
        const account = await new Account({ email: invitation.email }).save()
        const authUser = new AuthUserDto(account)
        const fetchAccountScope = () =>
          AccountScope.findOne({ where: { accountId: account.id, scopeId: invitation.scopeId } })
        let accountScope = await fetchAccountScope()
        expect(accountScope).toBeUndefined()

        await service.join(invitation.invitationToken, authUser)

        accountScope = await fetchAccountScope()
        expect(accountScope.accountId).toEqual(account.id)
        expect(accountScope.scopeId).toEqual(invitation.scopeId)
        expect(invitation.email).toBeDefined()
        expect(invitation.scopeId).toBeDefined()
        invitation = await ScopeInvitation.findOne({ where: { email: invitation.email, scopeId: invitation.scopeId } })
        expect(invitation).toBeUndefined()
      })
    })

    describe('already joined', () => {
      let invitation: ScopeInvitation
      let account: Account

      beforeEach(async () => {
        account = await Account.findOne(1)
        invitation = await service.create({ scopeId: 1, email: account.email })
      })

      afterEach(async () => {
        ScopeInvitation.delete({})
      })

      it('only remove invitation.', async () => {
        const authUser = new AuthUserDto(account)
        const countAccountScope = () =>
          AccountScope.count({ where: { accountId: account.id, scopeId: invitation.scopeId } })
        let count = await countAccountScope()
        expect(count).toEqual(1)

        await service.join(invitation.invitationToken, authUser)

        count = await countAccountScope()
        expect(count).toEqual(1)
        expect(invitation.email).toBeDefined()
        expect(invitation.scopeId).toBeDefined()
        invitation = await ScopeInvitation.findOne({ where: { email: invitation.email, scopeId: invitation.scopeId } })
        expect(invitation).toBeUndefined()
      })
    })
  })
})

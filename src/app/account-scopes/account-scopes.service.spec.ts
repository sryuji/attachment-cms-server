import { ForbiddenException } from '@nestjs/common'
import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
import PluginsSeed from '../../db/seed/test/plugin.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import { ValidationsError } from '../../exception/validations.error'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { AccountScopesService } from './account-scopes.service'
import { AccountScopeDto } from './dto/account-scope.dto'

describe('AccountScopesService', () => {
  let service: AccountScopesService

  beforeAll(async () => {
    const app = await compileModule([Account, AccountScope], [AccountScopesService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, PluginsSeed, ContentHistorySeed)

    service = app.get<AccountScopesService>(AccountScopesService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#create', () => {
    it('creates account scope', async () => {
      const account = await new Account({ email: 'test@example.com' }).save()
      const dto = new AccountScopeDto()
      dto.email = account.email
      dto.scopeId = 1
      const record = await service.create(dto)

      expect(record).toBeDefined()
      expect(record.id).toBeDefined()
      expect(record.accountId).toEqual(dto.accountId)
      expect(record.scopeId).toEqual(dto.scopeId)
    })

    it('can not create account. because invalid accountId', async () => {
      const dto = new AccountScopeDto()
      dto.email = 'invalid@example.com'
      dto.scopeId = 1
      await expect(service.create(dto)).rejects.toThrow(ValidationsError)
    })
  })

  describe('#authorizeScope', () => {
    it('authorizes by user.accountScopes', async () => {
      const scopeId = 1
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = await account.accountScopes
      const accountScope = await service.authorizeScope(user, scopeId)
      expect(accountScope).toBeDefined()
      expect(accountScope.scopeId).toEqual(scopeId)
      expect(accountScope.accountId).toEqual(account.id)
    })

    it('authorizes by database accountScopes table', async () => {
      const scopeId = 1
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = null
      const accountScope = await service.authorizeScope(user, scopeId)
      expect(accountScope).toBeDefined()
      expect(accountScope.scopeId).toEqual(scopeId)
      expect(accountScope.accountId).toEqual(account.id)
    })

    it('can not authorize. because No exists AccountScope ', async () => {
      const scopeId = 999
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = null
      await expect(service.authorizeScope(user, scopeId)).rejects.toThrowError(ForbiddenException)
    })
  })

  describe('#authorizeRole', () => {
    it('authorizes role without @Roles settings', async () => {
      const accountScope = new AccountScope({ accountId: 1, scopeId: 1, role: 'owner' })
      service.authorizeRole(accountScope, null)
    })

    it('authorizes role with @Roles settings', async () => {
      const accountScope = new AccountScope({ accountId: 1, scopeId: 1, role: 'owner' })
      service.authorizeRole(accountScope, ['owner'])
    })

    it('can not authorize. because No exists AccountScope', async () => {
      expect(() => service.authorizeRole(null, ['owner'])).toThrowError(Error)
    })

    it('can not authorize. because No has permitted role', async () => {
      const accountScope = new AccountScope({ accountId: 1, scopeId: 1, role: 'member' })
      expect(() => service.authorizeRole(accountScope, ['owner'])).toThrowError(ForbiddenException)
    })
  })
})

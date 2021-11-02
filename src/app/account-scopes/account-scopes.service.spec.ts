import { ForbiddenException } from '@nestjs/common'
import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
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
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, ContentHistorySeed)

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

  describe('#authorize', () => {
    it('authorizes by user.accountScopes', async () => {
      const scopeId = 1
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = await account.accountScopes
      await service.authorize(user, scopeId)
    })

    it('authorizes by database accountScopes table', async () => {
      const scopeId = 1
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = null
      await service.authorize(user, scopeId)
    })

    it('can not authorize. because No exists AccountScope ', async () => {
      const scopeId = 999
      const account = await Account.findOne(1)
      const user = new AuthUserDto(account)
      user.accountScopes = null
      await expect(service.authorize(user, scopeId)).rejects.toThrowError(ForbiddenException)
    })
  })
})

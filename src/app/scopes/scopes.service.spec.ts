import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import { AccountScope } from '../../db/entity/account-scope.entity'
import AccountScopeSeed from '../../db/seed/development/account-scope.seed'
import ScopeSeed from '../../db/seed/development/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import { ScopeDto } from './dto/scope.dto'
import { ScopeRepository } from './repository/scope.repository'

import { ScopesService } from './scopes.service'

describe('ScopesService', () => {
  let service: ScopesService

  beforeAll(async () => {
    const app = await compileModule([ScopeRepository, AccountScope], [ScopesService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed)

    service = app.get<ScopesService>(ScopesService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#findAll', () => {
    it('return scopes', async () => {
      const accountId = 1
      const dto: Partial<ScopeDto> = { name: 'test', domain: 'https://test.com', description: '説明' }
      const scope = await service.createWithAccountId(dto, accountId)
      expect(scope.id).toBeDefined()
      expect(scope.name).toEqual(dto.name)
      expect(scope.domain).toEqual(dto.domain)
      expect(scope.description).toEqual(dto.description)
      const accountScope = await AccountScope.findOne({ where: { accountId, scopeId: scope.id } })
      expect(accountScope).toBeDefined()
    })
  })
})

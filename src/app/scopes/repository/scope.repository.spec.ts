import { compileModule, runSeeds } from '../../../../test/helper/orm.helper'
import AccountScopeSeed from '../../../db/seed/development/account-scope.seed'
import ScopeSeed from '../../../db/seed/development/scope.seed'
import AccountSeed from '../../../db/seed/test/account.seed'
import { ScopeRepository } from './scope.repository'

describe('ScopeRepository', () => {
  let repository: ScopeRepository

  beforeAll(async () => {
    const app = await compileModule([ScopeRepository])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed)
    repository = app.get<ScopeRepository>(ScopeRepository)
  })

  describe('#findAll', () => {
    it('return scopes', async () => {
      const [scopeIds, page, per] = [[1, 2], 1, 1]
      const [scopes, pager] = await repository.findAll(scopeIds, page, per)
      expect(scopes.length).toEqual(1)
      expect(pager.totalCount).toEqual(2)
    })
  })
})

import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import { ContentHistory } from '../../db/entity/content-history.entity'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import { AccountsService } from './accounts.service'

describe('AccountService', () => {
  let service: AccountsService

  beforeAll(async () => {
    const app = await compileModule([Account, AccountScope], [AccountsService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, ContentHistorySeed)

    service = app.get<AccountsService>(AccountsService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#delete', () => {
    it('deletes account', async () => {
      const count = ContentHistory.count()
      await service.delete(1)
      const account = await Account.findOne(1)

      expect(account).toBeUndefined()
      const accountScopeCount = await AccountScope.count({ accountId: 1 })
      expect(accountScopeCount).toEqual(0)
      expect(ContentHistory.count()).toEqual(count)
    })
  })
})

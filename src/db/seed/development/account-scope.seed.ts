import { AccountScope } from '../../entity/account-scope.entity'
import { BaseSeed } from '../base.seed'

export default class AccountScopeSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        accountId: 1,
        scopeId: 1,
        role: 'owner',
      },
      {
        accountId: 1,
        scopeId: 2,
      },
      {
        accountId: 2,
        scopeId: 3,
      },
      {
        accountId: 3,
        scopeId: 4,
      },
    ]
    await this.createOrUpdate(seedList, AccountScope, ['accountId', 'scopeId'])
  }
}

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
        role: 'member',
      },
      {
        accountId: 2,
        scopeId: 1,
        role: 'member',
      },
    ]
    await this.createOrUpdate(seedList, AccountScope, ['accountId', 'scopeId'])
  }
}

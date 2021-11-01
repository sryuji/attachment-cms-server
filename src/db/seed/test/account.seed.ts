import { Account } from '../../entity/account.entity'
import { BaseSeed } from '../base.seed'

export default class AccountSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      { id: 1, email: '1@example.com' },
      { id: 2, email: '2@example.com' },
      { id: 3, email: '3@example.com' },
    ]
    await this.createOrUpdate(seedList, Account, ['email'])
  }
}

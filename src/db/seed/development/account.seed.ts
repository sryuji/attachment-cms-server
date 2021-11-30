import { Account } from '../../entity/account.entity'
import { BaseSeed } from '../base.seed'

export default class AccountSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        email: process.env.TEST_USER_EMAIL || '1@example.com',
      },
      { id: 2, email: '2@example.com' },
    ]
    await this.createOrUpdate(seedList, Account, ['email'])
  }
}

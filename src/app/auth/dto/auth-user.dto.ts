import { AccountScope } from '../../../db/entity/account-scope.entity'
import { Account } from '../../../db/entity/account.entity'

export class AuthUserDto {
  /**
   * account.idが格納される
   */
  readonly sub: number
  email: string
  accountScopes: AccountScope[]

  constructor(account?: Account) {
    if (!account) return
    this.sub = account.id
    this.email = account.email
  }

  toJSON() {
    return {
      sub: this.sub,
      email: this.email,
      accountScopes: this.accountScopes,
    }
  }
}

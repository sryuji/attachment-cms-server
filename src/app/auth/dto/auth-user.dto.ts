import { AccountScope } from '../../../db/entity/account-scope.entity'
import { Account } from '../../../db/entity/account.entity'

export class AuthUserDto {
  /**
   * account.idが格納される
   */
  sub: number
  email: string
  super: boolean
  accountScopes: AccountScope[]

  constructor(account?: Account) {
    if (!account) return
    this.sub = account.id
    this.email = account.email
    this.super = account.super
  }

  toJSON() {
    return {
      sub: this.sub,
      email: this.email,
      super: this.super,
      accountScopes: this.accountScopes,
    }
  }
}

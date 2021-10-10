import { AccountScope } from '../../../db/entity/account-scope.entity'
import { Account } from '../../../db/entity/account.entity'

export class AuthUserDto {
  // NOTE: accountId. JWTではIDトークンの対象ユーザーIDが格納される
  readonly sub: number
  readonly email: string
  readonly accountScopes: AccountScope[]

  constructor(account?: Account) {
    if (!account) return
    this.sub = account.id
    this.email = account.email
    this.accountScopes = account.accountScopes
  }

  toJSON() {
    return {
      sub: this.sub,
      email: this.email,
      accountScopes: this.accountScopes,
    }
  }
}

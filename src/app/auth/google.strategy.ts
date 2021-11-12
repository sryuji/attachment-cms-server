import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { AuthUserDto } from './dto/auth-user.dto'
import { ConfigService } from '../../config/config.service'
import { Account } from '../../db/entity/account.entity'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { DEMO_SCOPE_ID } from '../../constant/scope.constant'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private config: ConfigService

  constructor(config: ConfigService) {
    super({
      clientID: config.getString('GOOGLE_CLIENT_ID'),
      clientSecret: config.getString('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.getString('API_BASE_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
    })
    this.config = config
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile
    const email = emails[0].value
    let isNew = false
    let account = await Account.findOne({ where: { email } })
    if (!account) {
      account = new Account({ email, lastName: name.familyName, firstName: name.givenName, picture: photos[0].value })
      isNew = true
    }
    account.googleAccessToken = accessToken
    account.googleRefreshToken = refreshToken
    await account.save()

    if (isNew) {
      const accountScope = new AccountScope({ accountId: account.id, scopeId: DEMO_SCOPE_ID, role: 'member' })
      await accountScope.save()
    }

    const user = new AuthUserDto(account)
    done(null, user)
  }
}

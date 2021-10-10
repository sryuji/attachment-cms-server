import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { AuthUserDto } from './dto/auth-user.dto'
import { ConfigService } from '../../config/config.service'
import { Account } from '../../db/entity/account.entity'

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
    let account = await Account.findOne({ where: { email } })
    if (!account) {
      account = new Account({ email, lastName: name.familyName, firstName: name.givenName, picture: photos[0].value })
    }
    account.googleAccessToken = accessToken
    account.googleRefreshToken = refreshToken
    await account.save()

    const user = new AuthUserDto(account)
    done(null, user)
  }
}

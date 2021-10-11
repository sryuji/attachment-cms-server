import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Injectable } from '@nestjs/common'
import { ConfigService } from 'src/config/config.service'
import { Account } from 'src/db/entity/account.entity'
import { AuthUserDto } from './dto/auth-user.dto'

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

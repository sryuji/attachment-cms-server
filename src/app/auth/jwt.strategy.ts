import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from 'src/config/config.service'
import { AuthUserDto } from './dto/auth-user.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private config: ConfigService

  constructor(config: ConfigService) {
    const secret = config.getString('JWT_SECRET', true)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
    this.config = config
  }

  async validate(payload: AuthUserDto) {
    return { sub: payload.sub, email: payload.email, accountScopes: payload.accountScopes }
  }
}

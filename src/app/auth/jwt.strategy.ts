import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthUserDto } from './dto/auth-user.dto'
import { ConfigService } from '../../config/config.service'
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private config: ConfigService

  constructor(config: ConfigService) {
    const secret = config.getString('JWT_SECRET', true)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    })
    this.config = config
  }

  async validate(req: Request, payload: AuthUserDto, done: VerifiedCallback) {
    done(null, payload) // NOTE: このuserがreq.userに格納される
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { ConfigService } from '../../config/config.service'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { Account } from '../../db/entity/account.entity'
import { generateUUIDv4 } from '../../util/math'
import { AuthUserDto } from './dto/auth-user.dto'

export const REFRESH_TOKEN_COOKIE_KEY = 'RefreshToken'

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService, private jwtService: JwtService) {}

  async authenticateWithPassport(req: Request) {
    if (!req.user) throw new UnauthorizedException()
    const authUser = req.user as AuthUserDto
    return this.generateJwtToken(authUser)
  }

  async refreshAccessToken(jwtRefreshToken: string) {
    const account = await Account.findOne({ where: { jwtRefreshToken } })
    if (!account) throw new UnauthorizedException()

    const authUser = new AuthUserDto(account)
    const jwtAccessToken = await this.generateJwtAccessToken(authUser)
    const jwtAccessTokenMaxAge = this.configService.getNumber('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
    return { jwtAccessToken, jwtAccessTokenMaxAge }
  }

  async generateJwtToken(authUser: AuthUserDto) {
    const account = await Account.findOne(authUser.sub)
    if (!account) throw new UnauthorizedException()

    const jwtAccessToken = await this.generateJwtAccessToken(authUser)
    const jwtRefreshToken = generateUUIDv4()
    account.jwtRefreshToken = jwtRefreshToken
    account.jwtRefreshTokenIssuedAt = new Date()
    account.save()

    return { jwtAccessToken, jwtRefreshToken }
  }

  private async generateJwtAccessToken(authUser: AuthUserDto) {
    authUser.accountScopes = await AccountScope.find({ where: { accountId: authUser.sub } })
    return this.jwtService.sign(authUser.toJSON())
  }

  async signOut(req: Request) {
    if (!req.user) return
    const payload = req.user as AuthUserDto
    const account = await Account.findOne(payload.sub)
    account.jwtRefreshToken = null
    account.jwtRefreshTokenIssuedAt = null
    account.save()
  }
}

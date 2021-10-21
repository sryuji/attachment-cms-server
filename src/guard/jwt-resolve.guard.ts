import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * JWTトークンの解決のみ. 認証チェックはしない
 */
@Injectable()
export class JwtResolveGuard extends AuthGuard('jwt') {
  handleRequest<AuthUserDto>(err: Error, user: AuthUserDto): AuthUserDto {
    if (user) return user
    return null
  }
}

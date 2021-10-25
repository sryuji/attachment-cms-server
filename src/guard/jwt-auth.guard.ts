import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { judgeSkipAuth } from '../middleware/test.middleware'

/**
 * JWTトークンの認証
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    if (judgeSkipAuth(req)) return true
    return super.canActivate(context)
  }

  handleRequest<U>(err: Error, user: U, info: Error, context: ExecutionContext): U {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    if (judgeSkipAuth(req)) {
      // NOTE: TestMiddlewareでreq.userに既にデータが入ってる
      console.log('handleRequest', req.user)
      return req.user as U
    }

    if (err || info) throw new UnauthorizedException(err || info)
    if (!user) throw new UnauthorizedException('Can not get user from token.')
    return user
  }
}

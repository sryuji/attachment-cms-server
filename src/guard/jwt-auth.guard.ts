import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * JWTトークンの認証
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest()
    if (!isProduction && req.get('Authorization') === 'Bearer test') return true
    return super.canActivate(context)
  }
}

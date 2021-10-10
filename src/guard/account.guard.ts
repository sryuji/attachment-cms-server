import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { AuthUserDto } from '../app/auth/dto/auth-user.dto'

/**
 * アカウントデータに対する操作の認可
 */
@Injectable()
export class AccountGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp()
    const req: Request = ctx.getRequest()
    const user: AuthUserDto = req.user as AuthUserDto
    if (!user || !user.sub || !req.params.id) return false
    return user.sub.toString() === req.params.id
  }
}

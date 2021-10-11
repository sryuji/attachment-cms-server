import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AccountScopesService } from 'src/app/account-scopes/account-scopes.service'
import { AuthUserDto } from 'src/app/auth/dto/auth-user.dto'
import { SCOPE_GETTER_KEY, ScopeGetterHandler } from 'src/decorator/scope-getter.decorator'

/**
 * アカウントのScope操作の認可
 */
@Injectable()
export class AccountScopeGuard implements CanActivate {
  private accountScopesService: AccountScopesService
  constructor(private reflector: Reflector, private readonly moduleRef: ModuleRef) {}

  onModuleInit() {
    this.accountScopesService = this.moduleRef.get(AccountScopesService, { strict: false })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getter: ScopeGetterHandler = this.reflector.get<ScopeGetterHandler>(SCOPE_GETTER_KEY, context.getHandler())
    if (!getter) return true

    const ctx = context.switchToHttp()
    const req: Request = ctx.getRequest()
    const user: AuthUserDto = req.user as AuthUserDto
    const scopeId = await getter(req)
    if (!scopeId || !user) return false
    await this.accountScopesService.authorize(user, Number(scopeId))
    return true
  }
}

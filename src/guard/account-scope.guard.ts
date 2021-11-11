import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ModuleRef, Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AccountScopesService } from '../app/account-scopes/account-scopes.service'
import { AuthUserDto } from '../app/auth/dto/auth-user.dto'
import { AccountScope } from '../db/entity/account-scope.entity'
import { ROLES_KEY } from '../decorator/roles.decorator'
import { ScopeGetterHandler, SCOPE_GETTER_KEY } from '../decorator/scope-getter.decorator'
import { RoleType } from '../enum/role.enum'

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
    const ctx = context.switchToHttp()
    const req: Request = ctx.getRequest()
    const user: AuthUserDto = req.user as AuthUserDto

    const accountScope = await this.authorizeScope(context, req, user)
    await this.authorizeRole(context, accountScope)
    return true
  }

  private async authorizeScope(
    context: ExecutionContext,
    req: Request,
    user: AuthUserDto
  ): Promise<Partial<AccountScope>> {
    const handler: ScopeGetterHandler = this.reflector.get<ScopeGetterHandler>(SCOPE_GETTER_KEY, context.getHandler())
    if (!handler) return null

    const scopeId = await handler(req)
    return await this.accountScopesService.authorizeScope(user, Number(scopeId))
  }

  private async authorizeRole(context: ExecutionContext, accountScope: Partial<AccountScope>): Promise<void> {
    const roles = this.reflector.get<RoleType[]>(ROLES_KEY, context.getHandler())
    if (!roles || roles.length === 0) return
    this.accountScopesService.authorizeRole(accountScope, roles)
  }
}

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user
  if (!user || !user.sub) throw new UnauthorizedException()
  return req.user
})

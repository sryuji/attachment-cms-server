import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthUserDto } from '../app/auth/dto/auth-user.dto'
import { AccountScope } from '../db/entity/account-scope.entity'
import { Account } from '../db/entity/account.entity'

const isProduction = process.env.NODE_ENV === 'production'

export function judgeSkipAuth(req: Request) {
  return !isProduction && req.get('Authorization') === 'Bearer test'
}

// middlewares -> guards -> interceptors -> pipeの順のため、
@Injectable()
export class TestMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (judgeSkipAuth(req)) {
      const account = await Account.findOne(1)
      const authUser = new AuthUserDto(account)
      authUser.accountScopes = await AccountScope.find({ where: { accountId: authUser.sub } })
      req.user = authUser.toJSON()
      console.log('TestMiddleware', account, req.user)
    }
    next()
  }
}

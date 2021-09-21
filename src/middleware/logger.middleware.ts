import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '@nestjs/common'
import { format } from 'date-fns'

// middlewares -> guards -> interceptors -> pipeの順のため、
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now()
    res.locals.requestStartTime = now
    const startTime = format(now, 'yyyy-MM-dd HH:mm:ss.SSS')
    Logger.log(`Request ${req.method} ${req.originalUrl} at ${startTime}`)
    Logger.log({ body: req.body })
    next()
  }
}

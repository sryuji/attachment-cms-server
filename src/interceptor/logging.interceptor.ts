import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp()
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        this.logResponse(ctx, now)
      })
    )
  }

  private logResponse(ctx: HttpArgumentsHost, startTime: number, level: string = null) {
    // HACK: 苦肉の策だが、setTimeoutしないとresponse.stausCodeが正しく取れない
    setTimeout(() => {
      const res = ctx.getResponse()
      const delay = Date.now() - res.locals.requestStartTime // LoggerMiddlewareから引き継いでいる
      const message = `Response ${res.statusCode} response. ${delay}ms`
      Logger.log(message)
    }, 0)
  }
}

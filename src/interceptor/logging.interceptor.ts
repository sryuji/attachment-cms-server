import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        this.logResponse(ctx, now)
      }),
      catchError(error => {
        this.logResponse(ctx, now, 'warn')
        return throwError(error)
      }),
    )
  }

  private logResponse(ctx: HttpArgumentsHost, startTime: number, level: string = null) {
    // 苦肉の策だが、setTimeoutしないとresponse.stausCodeが正しく取れない
    setTimeout(() => {
      const res = ctx.getResponse()
      const delay = Date.now() - res.locals.requestStartTime // LoggerMiddlewareから引き継いでいる
      const message = `Response ${res.statusCode} response. ${delay}ms`
      if (level === 'error') {
        Logger.error(message, null, null, false)
      } else if (level === 'warn') {
        Logger.warn(message, null, false)
      } else {
        Logger.log(message, null, false)
      }
    }, 0)
  }
}

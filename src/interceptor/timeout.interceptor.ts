import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'

/**
 * TimeoutErrorが発行され、exception filterで503 responseを返す
 * ただし、処理が中断する訳ではないので処理は続行されている. あくまで通信処理のtimeout
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private ms: number
  constructor(ms: number) {
    this.ms = ms
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(timeout(this.ms))
  }
}

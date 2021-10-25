import { Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from './base-exception.filter'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  /**
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const status: number = exception.getStatus()
    let message: string | string[] = exception.message
    let options: Record<string, unknown> | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: string | any = exception.getResponse()
    if (res instanceof Object && res.error) {
      message = `${res.error}: ${res.message}`
    }
    if (this.config.isDev || ![400, 401, 403, 404, 409, 422].includes(status)) this.notify(exception)
    this.responseError(host, status, message, options)
  }
}

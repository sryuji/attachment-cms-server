import { Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from './base-exception.filter'

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  /**
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    let status: number = exception.getStatus()
    let message: string | string[] = exception.message
    let options: object | undefined
    const res: string | any = exception.getResponse()
    if (res instanceof Object && res.error) {
      message = `${res.error}: ${res.message}`
    }
    if (![400, 401, 403, 404, 409, 422].includes(status)) this.notify(exception)
    this.responseError(host, status, message, options)
  }
}

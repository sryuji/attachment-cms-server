import { Catch, ArgumentsHost } from '@nestjs/common'
import { BaseExceptionFilter } from './base-exception.filter'

@Catch()
export class AnyExceptionFilter extends BaseExceptionFilter {
  /**
   * throw new InternalServerErrorException(['test'])は、
   * Response: { statusCode: 500, error: "Internal Server Error", message: ['test'] }
   *
   * @param exception
   * @param host
   */
  catch(exception: Error, host: ArgumentsHost) {
    this.notify(exception, host.switchToHttp())
    this.responseError(host, 500, exception.message, null)
  }
}

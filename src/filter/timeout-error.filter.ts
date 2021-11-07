import { Catch, ArgumentsHost } from '@nestjs/common'
import { BaseExceptionFilter } from './base-exception.filter'
import { TimeoutError } from 'rxjs'

@Catch(TimeoutError)
export class TimeoutErrorFilter extends BaseExceptionFilter {
  /**
   * @param exception
   * @param host
   */
  catch(exception: Error, host: ArgumentsHost) {
    this.notify(exception, host.switchToHttp(), 'warn')
    this.responseError(host, 503, 'Timeout Error', null)
  }
}

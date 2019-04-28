import { Catch, ArgumentsHost } from '@nestjs/common'
import { FindRelationsNotFoundError } from 'typeorm/error/FindRelationsNotFoundError'
import { BaseExceptionFilter } from './base-exception.filter'

@Catch(FindRelationsNotFoundError)
export class FindRelationsNotFoundExceptionFilter extends BaseExceptionFilter {
  /**
   * @param exception
   * @param host
   */
  catch(exception: Error, host: ArgumentsHost) {
    this.notify(exception)
    this.responseError(host, 400, exception.message, null)
  }
}

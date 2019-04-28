import { Catch, ArgumentsHost } from '@nestjs/common'
import { BaseExceptionFilter } from './base-exception.filter'
import { ValidationsError } from '../exception/validations.error'

@Catch(ValidationsError)
export class ValidationsErrorFilter extends BaseExceptionFilter {
  /**
   * @param exception
   * @param host
   */
  catch(exception: ValidationsError, host: ArgumentsHost) {
    this.responseError(host, 422, exception.getMessages(), null)
  }
}

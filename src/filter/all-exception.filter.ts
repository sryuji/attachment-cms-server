import { Catch, ArgumentsHost, HttpException, Logger, Inject } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { ConfigService } from '../config/config.service'

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private config: ConfigService
  constructor(@Inject(ConfigService) config: ConfigService) {
    super()
    this.config = config
  }
  /**
   * throw new InternalServerErrorException(['test'])は、
   * Response: { statusCode: 500, error: "Internal Server Error", message: ['test'] }
   *
   * @param exception
   * @param host
   */
  catch(exception: Error, host: ArgumentsHost) {
    let notify = true
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      notify = ![400, 401, 403, 404, 409, 422].includes(status)
    }
    if (notify) this.notify(exception)
    super.catch(exception, host)
  }

  private notify(exception: Error) {
    if (exception instanceof HttpException && (this.config.isDev || this.config.isTest)) {
      // BaseExceptionFilterはHttpExceptionの時、出力してくれないため
      Logger.error(exception.message, exception.stack)
    }
    // Sentryへ通知
  }
}

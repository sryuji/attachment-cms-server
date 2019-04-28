import { ArgumentsHost, Logger, Inject, ExceptionFilter } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { Response } from 'express'

export abstract class BaseExceptionFilter implements ExceptionFilter {
  private config: ConfigService
  constructor(@Inject(ConfigService) config: ConfigService) {
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
    this.responseError(host, 500, exception.message, null)
  }

  protected responseError(
    host: ArgumentsHost,
    status: number,
    message: string | string[],
    options: object | undefined,
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    response.status(status).json({
      statusCode: status,
      message: message,
      options: options,
    })
  }

  protected notify(exception: Error, level = 'error') {
    if (this.config.isDev || this.config.isTest) {
      Logger.error(exception.message, exception.stack, null, false)
    }
    // Sentryへ通知
  }
}

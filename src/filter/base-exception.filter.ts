import { ArgumentsHost, Logger, Inject, ExceptionFilter } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { Response } from 'express'
import { Sentry } from '../sentry'
import { Handlers } from '@sentry/node'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'

export abstract class BaseExceptionFilter implements ExceptionFilter {
  protected config: ConfigService
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
    options: Record<string, unknown> | undefined
  ) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    response.status(status).json({
      statusCode: status,
      message: message,
      options: options,
    })
    this.logResponse(response, message)
  }

  private logResponse(res: Response, errorMessage: string | string[]) {
    const delay = Date.now() - res.locals.requestStartTime // NOTE: LoggerMiddlewareから引き継いでいる
    const code = res.statusCode
    errorMessage = Array.isArray(errorMessage) ? errorMessage.join('. ') : errorMessage
    const message = `Response ${code} response. ${delay}ms. ${errorMessage}`
    if (code && code < 400) {
      Logger.log(message)
    } else if (code && code < 500) {
      Logger.warn(message)
    } else {
      Logger.error(message)
    }
  }

  protected notify(exception: Error, http: HttpArgumentsHost, level = 'error') {
    if (this.config.isDev || this.config.isTest) {
      Logger.error(exception.message, exception.stack)
    }
    Sentry.withScope((scope) => {
      const data = Handlers.parseRequest({}, http.getRequest())
      scope.setExtra('req', data.request)
      data.extra && scope.setExtras(data.extra)
      if (data.user) scope.setUser(data.user)
      Sentry.captureException(exception)
    })
  }
}

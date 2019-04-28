import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ValidationsError } from '../exception/validations.error'
import { LoggingInterceptor } from '../interceptor/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => new ValidationsError(errors),
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor()) //, new TimeoutInterceptor(5000)
  await app.listen(3000)
}
bootstrap()

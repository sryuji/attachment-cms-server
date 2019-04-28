import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, INestApplication } from '@nestjs/common'
import { ValidationsError } from '../exception/validations.error'
import { LoggingInterceptor } from '../interceptor/logging.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
const packageJson = require('@/package.json')
const env: string = process.env.NODE_ENV || 'development'

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: errors => new ValidationsError(errors),
    }),
  )
  app.useGlobalInterceptors(new LoggingInterceptor()) //, new TimeoutInterceptor(5000)
  if (env !== 'production') setupSwagger(app)
  await app.listen(3000)
}
async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('attachment CMS')
    .setDescription('attachment CMS API description')
    .setVersion(packageJson.version)
    .addTag('API')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document) // api-docs-jsonでjson schema donwload
}
bootstrap()

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
      // DTOでvalidation定義されていないvalueは除去される. validation定義不要な場合、@Allowをつける
      // これがないと許可されてないpropもdto -> entityとbindできてしまう
      whitelist: true,
      // @Bodyなどvalidation対象がInjectされる時、Dtoにconvertする. falseだとobjectのまま.
      // propetyは@Typeで個別にconvert指示が必要
      transform: true,
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
    .addTag('CMS API', 'コンテンツ管理用API')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document) // api-docs-jsonでjson schema donwload
}
bootstrap()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, INestApplication } from '@nestjs/common'
import { ValidationsError } from '../exception/validations.error'
import { LoggingInterceptor } from '../interceptor/logging.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import packageJson = require('../../package.json')
import cookieParser = require('cookie-parser')
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { Sentry } from '../sentry'

const isProduction = process.env.NODE_ENV === 'production'

// https://github.com/expressjs/cors#configuration-options
const corsOptions: CorsOptions = {
  origin: (() => {
    return isProduction ? ['https://attachment-cms.dev'] : ['http://localhost:3001']
  })(),
  credentials: true,
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors(corsOptions)
  app.use(Sentry.Handlers.requestHandler({ user: ['sub', 'email'] }))
  app.use(Sentry.Handlers.tracingHandler())
  app.useGlobalPipes(
    new ValidationPipe({
      // NOTE: DTOでvalidation定義されていないvalueは除去される. validation定義が不要なfieldには、@Allowをつける事でwhitelistの一員と明示できる
      // `whitelist: true``で@Allowで許可する方式でないと、未許可のobject propertyがentityにbindされてしまうのでこの設定が必要
      whitelist: true,
      // NOTE: @Bodyなどvalidation対象がInjectされる時、Dtoにconvertする. falseだとobjectのまま. なお、formのfieldには@Typeを指定する事でjson object -> dtoへのconvertが行われる
      transform: true,
      exceptionFactory: (errors) => new ValidationsError(errors),
    })
  )
  if (!isProduction) {
    // NOTE: GCP Cloud Runでrequest logにresponse時間も出るため本番では不要
    app.useGlobalInterceptors(new LoggingInterceptor())

    setupSwagger(app)
  }
  const port = Number(process.env.PORT) || 3000
  await app.listen(port, '0.0.0.0')
}
async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('attachment CMS')
    .setDescription('attachment CMS API description')
    .setVersion(packageJson.version)
    .addTag('CMS API', 'コンテンツ管理用API')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: '本番環境以外では、valueに "test" と入力する事でJWT認証をスキップできます',
    })
    .addOAuth2()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)
}
bootstrap()

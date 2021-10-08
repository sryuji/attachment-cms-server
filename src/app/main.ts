import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, INestApplication } from '@nestjs/common'
import { ValidationsError } from '../exception/validations.error'
import { LoggingInterceptor } from '../interceptor/logging.interceptor'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import packageJson = require('../../package.json')
import cookieParser = require('cookie-parser')
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

const isProduction = process.env.NODE_ENV === 'production'

// https://github.com/expressjs/cors#configuration-options
const corsOptions: CorsOptions = {
  origin: (() => {
    return isProduction ? [''] : ['http://localhost:3001']
  })(),
  credentials: true,
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors(corsOptions)
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
  app.useGlobalInterceptors(new LoggingInterceptor()) //, new TimeoutInterceptor(5000)
  if (!isProduction) setupSwagger(app)
  await app.listen(3000)
}
async function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('attachment CMS')
    .setDescription('attachment CMS API description')
    .setVersion(packageJson.version)
    .addTag('CMS API', 'コンテンツ管理用API')
    .addBearerAuth({
      type: 'apiKey',
      description: '本番環境以外では、valueに "test" と入力する事でJWT認証をスキップできます',
    })
    .addOAuth2()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)
}
bootstrap()

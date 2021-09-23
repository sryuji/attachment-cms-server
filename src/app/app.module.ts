import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ScopesModule } from './scopes/scopes.module'
import { LoggerMiddleware } from '../middleware/logger.middleware'
import { ConfigModule } from '../config/config.module'
import { TypeOrmConfigService } from '../config/typeorm.config.service'
import { AnyExceptionFilter } from '../filter/any-exception.filter'
import { HttpExceptionFilter } from '../filter/http-exception.filter'
import { APP_FILTER } from '@nestjs/core'
import { FindRelationsNotFoundExceptionFilter } from '../filter/find-relations-not-found-exception.filter'
import { ValidationsErrorFilter } from '../filter/validations-error.filter'
import { TimeoutErrorFilter } from '../filter/timeout-error.filter'
import { ContentHistoriesModule } from './content-histories/content-histories.module'
import { ContentsModule } from './contents/contents.module'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ScopesModule,
    ContentHistoriesModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [
    // 後に定義した方が@Catchが先に評価される
    { provide: APP_FILTER, useClass: AnyExceptionFilter },
    { provide: APP_FILTER, useClass: TimeoutErrorFilter },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: FindRelationsNotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationsErrorFilter },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

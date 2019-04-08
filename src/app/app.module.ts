import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DomainsModule } from './domains/domains.module'
import { LoggerMiddleware } from '../middleware/logger.middleware'
import { ConfigModule } from '../config/config.module'
import { TypeOrmConfigService } from '../config/typeorm.config.service'
import { AllExceptionFilter } from '../filter/all-exception.filter'
import { APP_FILTER } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    DomainsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionFilter }, AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}

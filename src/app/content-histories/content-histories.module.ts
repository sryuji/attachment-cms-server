import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentHistoriesController } from './content-histories.controller'
import { ContentHistoriesService } from './content-histories.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { AccountScopesModule } from '../account-scopes/account-scopes.module'

@Module({
  imports: [TypeOrmModule.forFeature([ContentHistory]), AccountScopesModule],
  controllers: [ContentHistoriesController],
  providers: [ContentHistoriesService],
  exports: [ContentHistoriesService],
})
export class ContentHistoriesModule {}

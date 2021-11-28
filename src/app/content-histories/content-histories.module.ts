import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentHistoriesController } from './content-histories.controller'
import { ContentHistoriesService } from './content-histories.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { AccountScopesModule } from '../account-scopes/account-scopes.module'
import { PluginContentHistoriesService } from './plugin-content-histories.service'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'
import { PluginContentHistoriesController } from './plugin-content-histories.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ContentHistory, PluginContentHistory]), AccountScopesModule],
  controllers: [ContentHistoriesController, PluginContentHistoriesController],
  providers: [ContentHistoriesService, PluginContentHistoriesService],
  exports: [ContentHistoriesService],
})
export class ContentHistoriesModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentHistoriesController } from './content-histories.controller'
import { ContentHistoriesService } from './content-histories.service'
import { AccountScopesModule } from '../account-scopes/account-scopes.module'
import { PluginContentHistoriesService } from './plugin-content-histories.service'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'
import { PluginContentHistoriesController } from './plugin-content-histories.controller'
import { ReleaseContentHistory } from '../../db/entity/release-content-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ReleaseContentHistory, PluginContentHistory]), AccountScopesModule],
  controllers: [ContentHistoriesController, PluginContentHistoriesController],
  providers: [ContentHistoriesService, PluginContentHistoriesService],
  exports: [ContentHistoriesService],
})
export class ContentHistoriesModule {}

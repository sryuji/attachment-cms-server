import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Plugin } from '../../db/entity/plugin.entity'
import { PluginsController } from './plugins.controller'
import { PluginsService } from './plugins.service'

@Module({
  imports: [TypeOrmModule.forFeature([Plugin])],
  controllers: [PluginsController],
  providers: [PluginsService],
})
export class PluginsModule {}

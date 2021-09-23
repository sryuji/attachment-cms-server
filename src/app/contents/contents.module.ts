import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContentsController } from './contents.controller'
import { ContentsService } from './contents.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { Scope } from 'src/db/entity/scope.entity'
import { ReleaseRepository } from '../scopes/repository/release.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ContentHistory, Scope, ReleaseRepository])],
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}

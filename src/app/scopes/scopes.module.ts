import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScopesController } from './scopes.controller'
import { ScopesService } from './scopes.service'
import { Scope } from '../../db/entity/scope.entity'
import { ReleasesService } from './releases.service'
import { ReleasesController } from './release.controller'
import { ContentHistoriesModule } from '../content-histories/content-histories.module'
import { ReleaseRepository } from './repository/release.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Scope, ReleaseRepository]), ContentHistoriesModule],
  controllers: [ScopesController, ReleasesController],
  providers: [ScopesService, ReleasesService],
  exports: [ReleasesService],
})
export class ScopesModule {}

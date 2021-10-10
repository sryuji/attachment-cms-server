import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScopesController } from './scopes.controller'
import { ScopesService } from './scopes.service'
import { Scope } from '../../db/entity/scope.entity'
import { ReleasesService } from './releases.service'
import { ReleasesController } from './release.controller'
import { ContentHistoriesModule } from '../content-histories/content-histories.module'
import { ReleaseRepository } from './repository/release.repository'
import { AccountScope } from '../../db/entity/account-scope.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Scope, AccountScope, ReleaseRepository]), ContentHistoriesModule],
  controllers: [ScopesController, ReleasesController],
  providers: [ScopesService, ReleasesService],
  exports: [ReleasesService],
})
export class ScopesModule {}

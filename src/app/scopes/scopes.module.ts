import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScopesController } from './scopes.controller'
import { ScopesService } from './scopes.service'
import { ReleasesService } from './releases.service'
import { ReleasesController } from './release.controller'
import { ContentHistoriesModule } from '../content-histories/content-histories.module'
import { ReleaseRepository } from './repository/release.repository'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { ScopeRepository } from './repository/scope.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ScopeRepository, AccountScope, ReleaseRepository]), ContentHistoriesModule],
  controllers: [ScopesController, ReleasesController],
  providers: [ScopesService, ReleasesService],
  exports: [ReleasesService],
})
export class ScopesModule {}

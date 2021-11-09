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
import { ScopeInvitation } from '../../db/entity/scope-invitation.entity'
import { ScopeInvitationsController } from './scope-invitations.controller'
import { ScopeInvitationsService } from './scope-invitations.service'
import { AccountScopesModule } from '../account-scopes/account-scopes.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([ScopeRepository, AccountScope, ScopeInvitation, ReleaseRepository]),
    ContentHistoriesModule,
    AccountScopesModule,
  ],
  controllers: [ScopesController, ReleasesController, ScopeInvitationsController],
  providers: [ScopesService, ReleasesService, ScopeInvitationsService],
  exports: [ReleasesService],
})
export class ScopesModule {}

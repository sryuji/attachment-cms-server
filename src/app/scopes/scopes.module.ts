import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScopesController } from './scopes.controller'
import { ScopesService } from './scopes.service'
import { Scope } from '../../db/entity/scope.entity'
import { ReleasesService } from './releases.service'
import { ReleasesController } from './release.controller'
import { Release } from '@/src/db/entity/release.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Scope, Release])],
  controllers: [ScopesController, ReleasesController],
  providers: [ScopesService, ReleasesService],
})
export class ScopesModule {}

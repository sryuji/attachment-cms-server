import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScopesController } from './scopes.controller'
import { ScopesService } from './scopes.service'
import { Scope } from '../../db/entity/scope.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Scope])],
  controllers: [ScopesController],
  providers: [ScopesService],
})
export class ScopesModule {}

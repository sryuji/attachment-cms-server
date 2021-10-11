import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountScope } from 'src/db/entity/account-scope.entity'
import { AccountScopesController } from './account-scopes.controller'
import { AccountScopesService } from './account-scopes.service'

@Module({
  imports: [TypeOrmModule.forFeature([AccountScope])],
  controllers: [AccountScopesController],
  providers: [AccountScopesService],
  exports: [AccountScopesService],
})
export class AccountScopesModule {}

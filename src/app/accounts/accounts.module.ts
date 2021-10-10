import { Module } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { AccountsController } from './accounts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account } from '../../db/entity/account.entity'
import { AccountScope } from '../../db/entity/account-scope.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountScope])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountModule {}

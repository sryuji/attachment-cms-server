import { Module } from '@nestjs/common'
import { AccountsService } from './accounts.service'
import { AccountsController } from './accounts.controller'
import { Account } from 'src/db/entity/account.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountScope } from 'src/db/entity/account-scope.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountScope])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountModule {}

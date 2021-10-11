import { IsNumber } from 'class-validator'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Account } from './account.entity'
import { ApplicationEntity } from './application.entity'
import { Scope } from './scope.entity'

@Entity()
export class AccountScope extends ApplicationEntity<AccountScope> {
  @Column({ nullable: false })
  @IsNumber()
  accountId: number

  @ManyToOne((type) => Account, (r) => r.accountScopes, { lazy: true })
  account: Account

  @Column({ nullable: false })
  @IsNumber()
  scopeId: number

  @ManyToOne((type) => Scope, (r) => r.accountScopes, { lazy: true })
  scope: Scope
}

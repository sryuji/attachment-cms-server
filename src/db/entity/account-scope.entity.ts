import { IsNumber } from 'class-validator'
import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { Account } from './account.entity'
import { ApplicationEntity } from './application.entity'
import { Scope } from './scope.entity'

@Entity()
@Index(['accountId', 'scopeId'], { unique: true })
export class AccountScope extends ApplicationEntity<AccountScope> {
  @Column({ nullable: false })
  @IsNumber()
  accountId: number

  @ManyToOne((type) => Account, (r) => r.accountScopes)
  account: Account

  @Column({ nullable: false })
  @IsNumber()
  scopeId: number

  @ManyToOne((type) => Scope, (r) => r.accountScopes)
  scope: Scope

  @Column({ nullable: false, default: 'member' })
  role: string
}

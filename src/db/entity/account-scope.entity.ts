import { IsIn } from 'class-validator'
import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { Role } from '../../enum/role.enum'
import { Account } from './account.entity'
import { ApplicationEntity } from './application.entity'
import { Scope } from './scope.entity'

@Entity()
@Index(['accountId', 'scopeId'], { unique: true })
export class AccountScope extends ApplicationEntity<AccountScope> {
  @Column({ nullable: false })
  accountId: number

  @ManyToOne((type) => Account, (r) => r.accountScopes)
  account: Account

  @Column({ nullable: false })
  scopeId: number

  @ManyToOne((type) => Scope, (r) => r.accountScopes)
  scope: Scope

  @Column({ nullable: false, default: 'member' })
  @IsIn(Object.values(Role))
  role: string
}

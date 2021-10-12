import { Exclude } from 'class-transformer'
import { Column, Entity, OneToMany, Unique } from 'typeorm'
import { AccountScope } from './account-scope.entity'
import { ApplicationEntity } from './application.entity'

@Unique(['email'])
@Unique(['jwtRefreshToken'])
@Entity()
export class Account extends ApplicationEntity<Account> {
  @Column({ nullable: false })
  email: string

  @Column({ length: 64, nullable: true })
  lastName: string

  @Column({ length: 64, nullable: true })
  firstName: string

  @Column({ nullable: true })
  avatarUrl: string

  @Exclude()
  @Column({ nullable: true })
  jwtRefreshToken: string

  @Exclude()
  @Column({ nullable: true })
  jwtRefreshTokenIssuedAt: Date

  @Exclude()
  @Column({ nullable: true })
  googleAccessToken: string

  @Exclude()
  @Column({ nullable: true })
  googleRefreshToken: string

  @Exclude()
  @Column({ nullable: true })
  authenticatedAt: Date

  @OneToMany(() => AccountScope, (r) => r.account)
  accountScopes: AccountScope[]
}

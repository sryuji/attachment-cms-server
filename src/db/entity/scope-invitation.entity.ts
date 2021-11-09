import { BeforeInsert, Column, Entity, Index, Unique } from 'typeorm'
import { generateUUIDv4 } from '../../util/math'
import { ApplicationEntity } from './application.entity'

@Entity()
@Unique(['invitationToken'])
export class ScopeInvitation extends ApplicationEntity<ScopeInvitation> {
  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  @Index()
  scopeId: number

  @Column({ nullable: true })
  invitationToken: string

  @Column({ nullable: true })
  joinedAt: Date

  @BeforeInsert()
  generateToken(): void {
    if (this.invitationToken) return
    this.invitationToken = generateUUIDv4()
  }
}

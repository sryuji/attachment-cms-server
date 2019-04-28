import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'
import { Scope } from './scope.entity'
import { ContentHistory } from './content-history.entity'

@Entity()
export class Release extends ApplicationBaseEntity<Release> {
  @ManyToOne(type => Scope, scope => scope.releases)
  scope: Scope

  @Column({ length: 255 })
  limitedReleaseToken: string

  @Column()
  limitedReleaseTokenIssuedAt: Date

  @Column()
  releasedAt: Date

  @Column()
  rollbackedAt: Date

  @OneToMany(type => ContentHistory, r => r.release)
  contentHistories: ContentHistory[]
}

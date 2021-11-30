import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Scope } from './scope.entity'
import { ContentHistory } from './content-history.entity'

@Entity()
@Unique(['limitedReleaseToken'])
export class Release extends ApplicationEntity<Release> {
  @Column()
  @Index()
  scopeId: number

  @ManyToOne((type) => Scope, (scope) => scope.releases, { lazy: true })
  scope: Scope

  @Column()
  name: string

  @Column({ length: 255, nullable: true })
  limitedReleaseToken: string

  @Column({ nullable: true })
  limitedReleaseTokenIssuedAt: Date

  @Column({ nullable: true })
  releasedAt: Date

  @Column({ nullable: true })
  rollbackedAt: Date

  @Column({ nullable: true })
  @Index()
  sourceReleaseId: number

  @OneToMany((type) => ContentHistory, (r) => r.release)
  contentHistories: ContentHistory[]
}

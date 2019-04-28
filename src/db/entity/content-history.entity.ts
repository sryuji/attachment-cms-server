import { Column, Entity, ManyToOne } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'
import { Release } from './release.entity'
import { Scope } from './scope.entity'

@Entity()
export class ContentHistory extends ApplicationBaseEntity<ContentHistory> {
  @Column()
  scopeId: number
  @ManyToOne(type => Scope)
  scope: Scope

  @Column()
  releaseId: number
  @ManyToOne(type => Release, r => r.contentHistories)
  release: Release

  @Column()
  path: string

  @Column('text', { nullable: true })
  selector: string

  @Column('text', { nullable: true })
  content: string

  @Column({ nullable: true })
  action: string

  @Column({ default: false })
  inactive: boolean

  @ManyToOne(type => ContentHistory)
  sourceContentHistory: ContentHistory
}

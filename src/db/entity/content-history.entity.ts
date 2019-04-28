import { Column, Entity, ManyToOne } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'
import { Release } from './release.entity'
import { Scope } from './scope.entity'

@Entity()
export class ContentHistory extends ApplicationBaseEntity<ContentHistory> {
  @ManyToOne(type => Scope)
  scope: Scope

  @ManyToOne(type => Release, r => r.contentHistories)
  release: Release

  @Column()
  path: string

  @Column('text')
  selector: string

  @Column('text')
  content: string

  @Column()
  action: string

  @Column({ default: false })
  inactive: boolean

  @ManyToOne(type => ContentHistory)
  sourceContentHistory: ContentHistory
}

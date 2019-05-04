import { Column, Entity, ManyToOne } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Release } from './release.entity'
import { Scope } from './scope.entity'
import { IsNumber } from 'class-validator'

@Entity()
export class ContentHistory extends ApplicationEntity<ContentHistory> {
  @Column()
  @IsNumber()
  scopeId: number

  @ManyToOne(type => Scope)
  scope: Scope

  @Column()
  @IsNumber()
  releaseId: number

  @ManyToOne(type => Release, r => r.contentHistories, { lazy: true })
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
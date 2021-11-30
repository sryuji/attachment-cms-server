import { Column, Entity, Index, ManyToOne, TableInheritance } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Release } from './release.entity'
import { Scope } from './scope.entity'
import { IsNumber, IsOptional } from 'class-validator'

@Entity()
@TableInheritance({ column: { name: 'type' } })
export class ContentHistory extends ApplicationEntity<ContentHistory> {
  @Column({ length: 64, nullable: false, default: 'ReleaseContentHistory' })
  type: string

  @Column()
  @IsNumber()
  @Index()
  scopeId: number

  @ManyToOne((type) => Scope)
  scope: Scope

  @Column({ nullable: true })
  @Index()
  releaseId: number

  @ManyToOne((type) => Release, (r) => r.contentHistories, { lazy: true })
  release: Release

  @Column()
  path: string

  @Column({ nullable: true })
  description: string

  @Column('text', { nullable: true })
  selector: string

  @Column('text', { nullable: true })
  content: string

  @Column({ nullable: true })
  action: string

  @Column({ default: false })
  inactive: boolean

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  @Index()
  sourceContentHistoryId: number

  @Column({ default: false })
  isUpdated: boolean
}

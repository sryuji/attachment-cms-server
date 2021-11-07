import { Column, Entity, Index, ManyToOne } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Release } from './release.entity'
import { Scope } from './scope.entity'
import { IsNumber, IsOptional } from 'class-validator'

@Entity()
export class ContentHistory extends ApplicationEntity<ContentHistory> {
  @Column()
  @IsNumber()
  @Index()
  scopeId: number

  @ManyToOne((type) => Scope)
  scope: Scope

  @Column()
  @IsNumber()
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
}

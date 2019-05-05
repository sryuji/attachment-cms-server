import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Scope } from './scope.entity'
import { ContentHistory } from './content-history.entity'
import { IsOptional, IsNumber } from 'class-validator'
import { Exclude } from 'class-transformer'

@Entity()
export class Release extends ApplicationEntity<Release> {
  @Column()
  @IsNumber()
  scopeId: number

  @ManyToOne(type => Scope, scope => scope.releases, { lazy: true })
  scope: Scope

  @Exclude()
  @Column({ length: 255, nullable: true })
  limitedReleaseToken: string

  @Column({ nullable: true })
  limitedReleaseTokenIssuedAt: Date

  @Column({ nullable: true })
  releasedAt: Date

  @Column({ nullable: true })
  rollbackedAt: Date

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  sourceReleaseId: number

  @OneToMany(type => ContentHistory, r => r.release)
  contentHistories: ContentHistory[]
}

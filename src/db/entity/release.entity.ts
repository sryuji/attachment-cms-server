import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'
import { Scope } from './scope.entity'
import { ContentHistory } from './content-history.entity'
import { IsOptional, IsNumber } from 'class-validator'

@Entity()
export class Release extends ApplicationBaseEntity<Release> {
  @Column()
  @IsNumber()
  @IsOptional()
  scopeId: number

  @ManyToOne(type => Scope, scope => scope.releases, { lazy: true })
  scope: Scope

  @Column({ length: 255, nullable: true })
  limitedReleaseToken: string

  @Column({ nullable: true })
  limitedReleaseTokenIssuedAt: Date

  @Column({ nullable: true })
  releasedAt: Date

  @Column({ nullable: true })
  rollbackedAt: Date

  @OneToMany(type => ContentHistory, r => r.release)
  contentHistories: ContentHistory[]
}

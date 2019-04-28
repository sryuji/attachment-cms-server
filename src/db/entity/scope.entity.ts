import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm'
import { ApplicationBaseEntity } from './application-base.entity'
import { Release } from './release.entity'
import { Expose } from 'class-transformer'
import { IsNumber, IsOptional, ValidateIf } from 'class-validator'

@Entity()
export class Scope extends ApplicationBaseEntity<Scope> {
  @Column({ length: 255, nullable: true }) // length未指定は英数100kb, UTF-8日本語なら300kb.
  name: string

  private _domain: string
  // setterでnoramalize調整したいケースには,下記のようにgetter/setterを定義する
  @Column({ length: 255, name: 'domain' })
  @Expose()
  get domain() {
    return this._domain
  }
  set domain(v: string) {
    this._domain = v
  }

  @Column({ length: 255, nullable: true })
  testDomain: string

  @Column('text', { nullable: true }) // text指定は無制限
  description: string

  @OneToMany(type => Release, r => r.scope)
  releases: Release[]

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  defaultReleaseId: number

  @OneToOne(type => Release, r => r.scope, { lazy: true }) // eagerで自動join, lazyはpropety access時にquery取得
  @JoinColumn()
  defaultRelease: Release

  // @OneToMany(type => ContentHistory, contentHistory => contentHistory.scope)
  // contentHistories: ContentHistory[]
}

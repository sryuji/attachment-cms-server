import { Column, Entity, OneToMany, OneToOne, JoinColumn, BeforeInsert, Unique } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Release } from './release.entity'
import { Expose, Exclude } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { generateUUIDv4 } from '../../util/math'

@Unique(['token'])
@Entity()
export class Scope extends ApplicationEntity<Scope> {
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

  @Column({ length: 255 })
  @Exclude()
  token: string

  @OneToMany((type) => Release, (r) => r.scope)
  releases: Release[]

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  defaultReleaseId: number

  @OneToOne((type) => Release, (r) => r.scope, { lazy: true }) // eagerで自動join, lazyはpropety access時にquery取得
  @JoinColumn()
  defaultRelease: Release

  // @OneToMany(type => ContentHistory, contentHistory => contentHistory.scope)
  // contentHistories: ContentHistory[]

  @BeforeInsert()
  generateToken(): void {
    this.token = generateUUIDv4()
  }
}

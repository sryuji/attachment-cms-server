import { Column, Entity, OneToMany, OneToOne, JoinColumn, BeforeInsert, Unique } from 'typeorm'
import { ApplicationEntity } from './application.entity'
import { Release } from './release.entity'
import { Expose } from 'class-transformer'
import { generateUUIDv4 } from '../../util/math'
import { AccountScope } from './account-scope.entity'

@Unique(['token'])
@Entity()
export class Scope extends ApplicationEntity<Scope> {
  @Column({ length: 255, nullable: false }) // length未指定は英数100kb, UTF-8日本語なら300kb.
  name: string

  private _domain: string
  // setterでnoramalize調整したいケースには,下記のようにgetter/setterを定義する
  @Column({ length: 255, name: 'domain', nullable: true })
  @Expose()
  get domain() {
    return this._domain
  }
  set domain(v: string) {
    this._domain = v
  }

  @Column('text', { nullable: true }) // text指定は無制限
  description: string

  @Column({ length: 255 })
  token: string

  @OneToMany((type) => Release, (r) => r.scope)
  releases: Release[]

  @Column({ nullable: true })
  defaultReleaseId: number

  @OneToOne((type) => Release, (r) => r.scope, { lazy: true }) // eagerで自動join, lazyはpropety access時にquery取得
  @JoinColumn()
  defaultRelease: Release

  // @OneToMany(type => ContentHistory, contentHistory => contentHistory.scope)
  // contentHistories: ContentHistory[]

  @BeforeInsert()
  generateToken(): void {
    if (this.token) return
    this.token = generateUUIDv4()
  }

  @OneToMany((type) => AccountScope, (r) => r.account)
  accountScopes: AccountScope[]
}

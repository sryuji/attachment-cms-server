import { Expose, Exclude, Type } from 'class-transformer'
import { Scope } from '@/src/db/entity/scope.entity'

// EntityのSerialize設定を使わず、個別にserialize仕方を変えたい場合は下記のように定義可能
export class ScopeCustomSerializer extends Scope {
  @Expose({ name: 'createdAt' })
  getCreatedAt(): Date {
    return this.createdAt
  }

  @Exclude()
  testDomain: string

  constructor(scope: Scope) {
    super()
    Object.assign(this, scope)
  }
}

export class ScopeOneSerializer {
  @Type(() => ScopeCustomSerializer)
  readonly scope: ScopeCustomSerializer

  constructor(scope: Scope) {
    this.scope = new ScopeCustomSerializer(scope)
  }
}

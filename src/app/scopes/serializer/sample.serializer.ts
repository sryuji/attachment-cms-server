import { Expose, Exclude } from 'class-transformer'
import { Scope } from '../../../db/entity/scope.entity'

// EntityのSerialize設定を使わず、個別にserialize仕方を変えたい場合は下記のように定義可能
export class SampleSerializer extends Scope {
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

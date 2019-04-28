// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Pager } from '../../base/pager'
import { Scope } from '@/src/db/entity/scope.entity'

export class ScopesSerializer {
  @Type(() => Scope)
  readonly scopes: Scope[]
  readonly pager?: Pager
  constructor(attributes: ScopesSerializer) {
    Object.assign(this, attributes)
  }
}

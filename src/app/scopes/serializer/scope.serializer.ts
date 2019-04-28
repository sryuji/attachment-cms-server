// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Scope } from '@/src/db/entity/scope.entity'

export class ScopeSerializer {
  @Type(() => Scope)
  readonly scope: Scope

  constructor(scope: Scope) {
    this.scope = scope
  }
}

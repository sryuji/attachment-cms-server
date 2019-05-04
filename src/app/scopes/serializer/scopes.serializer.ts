// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Pager } from '../../base/pager'
import { Scope } from '../../../db/entity/scope.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ScopesSerializer extends BaseSerializer {
  @Type(() => Scope)
  readonly scopes: Scope[]
  readonly pager?: Pager
}

// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Scope } from '../../../db/entity/scope.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ScopeSerializer extends BaseSerializer {
  @Type(() => Scope)
  readonly scope: Scope
}

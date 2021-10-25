// https://github.com/typestack/class-transformer
import { Scope } from '../../../db/entity/scope.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ScopeSerializer extends BaseSerializer {
  scope: Scope
}

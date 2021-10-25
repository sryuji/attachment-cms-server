// https://github.com/typestack/class-transformer
import { Scope } from '../../../db/entity/scope.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class ScopesSerializer extends CollectionSerializer {
  scopes: Scope[]
}

// https://github.com/typestack/class-transformer
import { Scope } from '../../../db/entity/scope.entity'
import { CollectionSerializer } from 'src/app/base/collection.serializer'

export class ScopesSerializer extends CollectionSerializer {
  readonly scopes: Scope[]
}

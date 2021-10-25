// https://github.com/typestack/class-transformer
import { ApiResponseProperty } from '@nestjs/swagger'
import { Scope } from '../../../db/entity/scope.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class ScopesSerializer extends CollectionSerializer {
  @ApiResponseProperty({ type: Scope })
  scopes: Scope[]
}

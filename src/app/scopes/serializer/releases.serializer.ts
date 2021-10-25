// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseProperty } from '@nestjs/swagger'
import { CollectionSerializer } from '../../base/collection.serializer'

export class ReleasesSerializer extends CollectionSerializer {
  @ApiResponseProperty({ type: Release })
  releases: Release[]
}

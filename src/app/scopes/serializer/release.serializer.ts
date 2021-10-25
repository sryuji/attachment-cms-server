// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'

export class ReleaseSerializer extends BaseSerializer {
  @ApiResponseProperty({ type: Release })
  release: Release
}

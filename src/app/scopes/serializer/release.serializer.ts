// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'

export class ReleaseSerializer extends BaseSerializer {
  @ApiResponseModelProperty({ type: Release })
  readonly release: Release
}

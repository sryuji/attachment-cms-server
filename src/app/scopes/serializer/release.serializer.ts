// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'
import { Type } from 'class-transformer'

export class ReleaseSerializer extends BaseSerializer {
  @Type(() => Release)
  @ApiResponseProperty({ type: Release })
  release: Release
}

// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'
import { Pager } from '../../base/pager'

export class ReleaseWithPagerSerializer extends BaseSerializer {
  @ApiResponseProperty({ type: Release })
  release: Release

  @ApiResponseProperty({ type: Pager })
  pager?: Pager
}

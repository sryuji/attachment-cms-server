// https://github.com/typestack/class-transformer
import { Pager } from '../../base/pager'
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'

export class ReleasesSerializer extends BaseSerializer {
  @ApiResponseModelProperty({ type: Release })
  readonly releases: Release[]

  @ApiResponseModelProperty({ type: Pager })
  readonly pager?: Pager
}

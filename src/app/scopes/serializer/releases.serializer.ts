// https://github.com/typestack/class-transformer
import { Pager } from '../../base/pager'
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'

export class ReleasesSerializer extends BaseSerializer {
  @ApiResponseProperty({ type: Release })
  readonly releases: Release[]

  @ApiResponseProperty({ type: Pager })
  readonly pager?: Pager
}

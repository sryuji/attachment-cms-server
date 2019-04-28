// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Pager } from '../../base/pager'
import { Release } from '@/src/db/entity/release.entity'
import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'

export class ReleasesSerializer extends BaseSerializer {
  @ApiResponseModelProperty({ type: Release })
  @Type(() => Release)
  readonly releases: Release[]

  @ApiResponseModelProperty({ type: Pager })
  readonly pager?: Pager
}

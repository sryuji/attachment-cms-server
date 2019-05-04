import { ApiResponseModelProperty } from '@nestjs/swagger'
import { Pager } from './pager'
import { BaseSerializer } from './base.serializer'

export abstract class CollectionSerializer extends BaseSerializer {
  @ApiResponseModelProperty({ type: Pager })
  readonly pager?: Pager
}

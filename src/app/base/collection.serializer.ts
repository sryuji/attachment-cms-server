import { ApiResponseProperty } from '@nestjs/swagger'
import { Pager } from './pager'
import { BaseSerializer } from './base.serializer'

export abstract class CollectionSerializer extends BaseSerializer {
  @ApiResponseProperty({ type: Pager })
  pager?: Pager
}

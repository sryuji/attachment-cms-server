// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Pager } from '../../base/pager'
import { ContentHistory } from '@/src/db/entity/content-history.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ContentHistoriesSerializer extends BaseSerializer {
  @Type(() => ContentHistory)
  readonly scopes: ContentHistory[]
  readonly pager?: Pager
}

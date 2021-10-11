// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Pager } from '../../base/pager'
import { ContentHistory } from '../../../db/entity/content-history.entity'
import { CollectionSerializer } from 'src/app/base/collection.serializer'

export class ContentHistoriesSerializer extends CollectionSerializer {
  @Type(() => ContentHistory)
  readonly scopes: ContentHistory[]
  readonly pager?: Pager
}

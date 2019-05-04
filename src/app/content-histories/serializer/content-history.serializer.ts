// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { ContentHistory } from '../../../db/entity/content-history.entity'
import { CollectionSerializer } from 'src/app/base/collection.serializer'

export class ContentHistorySerializer extends CollectionSerializer {
  @Type(() => ContentHistory)
  readonly scope: ContentHistory
}

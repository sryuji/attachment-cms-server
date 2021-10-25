// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { ContentHistory } from '../../../db/entity/content-history.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class ContentHistoriesSerializer extends CollectionSerializer {
  @Type(() => ContentHistory)
  scopes: ContentHistory[]
}

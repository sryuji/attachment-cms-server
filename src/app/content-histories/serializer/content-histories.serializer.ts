// https://github.com/typestack/class-transformer
import { ContentHistory } from '../../../db/entity/content-history.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class ContentHistoriesSerializer extends CollectionSerializer {
  contentHistories: ContentHistory[]
}

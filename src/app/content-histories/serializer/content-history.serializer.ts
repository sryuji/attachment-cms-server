// https://github.com/typestack/class-transformer
import { ContentHistory } from '../../../db/entity/content-history.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ContentHistorySerializer extends BaseSerializer {
  contentHistory: ContentHistory
}

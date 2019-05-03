// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { ContentHistory } from '@/src/db/entity/content-history.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ContentHistorySerializer extends BaseSerializer {
  @Type(() => ContentHistory)
  readonly scope: ContentHistory
}

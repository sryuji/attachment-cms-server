// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { BaseSerializer } from '../../base/base.serializer'
import { ContentDto } from '../dto/content.dto'

export class ContentsSerializer extends BaseSerializer {
  @Type(() => ContentDto)
  readonly contents: ContentDto[]
}

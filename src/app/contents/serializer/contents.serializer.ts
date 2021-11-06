import { ContentHistory } from '../../../db/entity/content-history.entity'
import { BaseSerializer } from '../../base/base.serializer'
import { ContentDto } from '../dto/content.dto'

export class ContentsSerializer extends BaseSerializer {
  contents: Record<string, Partial<ContentDto>[]> = {}

  public serialize(collection: ContentHistory[]) {
    collection.forEach((r) => {
      const path = r.path.replace(/:word/g, 'w+').trim()
      if (!this.contents[path]) this.contents[path] = []
      const content = r.content && r.content.trim()
      this.contents[path].push({ selector: r.selector, content, action: r.action })
    })
    return this
  }
}

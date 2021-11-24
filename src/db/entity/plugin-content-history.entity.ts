import { ChildEntity, OneToOne } from 'typeorm'
import { ContentHistory } from './content-history.entity'
import { Plugin } from './plugin.entity'

@ChildEntity()
export class PluginContentHistory extends ContentHistory {
  @OneToOne((type) => Plugin, (r) => r.contentHistory)
  plugin: Plugin
}

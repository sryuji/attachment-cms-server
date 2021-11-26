import { Plugin } from '../../../db/entity/plugin.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class PluginSerializer extends BaseSerializer {
  plugin: Plugin
}

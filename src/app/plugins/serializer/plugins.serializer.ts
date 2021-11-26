import { Plugin } from '../../../db/entity/plugin.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class PluginsSerializer extends CollectionSerializer {
  plugins: Plugin[]
}

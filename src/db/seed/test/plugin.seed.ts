import { PluginFile } from '../../entity/plugin-file.entity'
import { Plugin } from '../../entity/plugin.entity'
import { BaseSeed } from '../base.seed'

export default class PluginsSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        name: 'basic Plugin',
        content: '<link rel="stylesheet" href="s" />',
      },
    ]
    await this.createOrUpdate(seedList, Plugin, ['id'])
    const fileList = [
      {
        id: 1,
        url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.css',
        kind: 'css',
        pluginId: 1,
      },
    ]
    await this.createOrUpdate(fileList, PluginFile, ['id'])
  }
}

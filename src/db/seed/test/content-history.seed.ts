import { PluginContentHistory } from '../../entity/plugin-content-history.entity'
import { ReleaseContentHistory } from '../../entity/release-content-history.entity'
import { BaseSeed } from '../base.seed'

export default class ContentHistorySeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        scopeId: 1,
        releaseId: 1,
        path: '/',
        selector: 'body > div',
        content: '<span>テスト</span>',
        action: 'innerHTML',
      },
      {
        id: 2,
        scopeId: 1,
        releaseId: 2,
        path: '/',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'insertBefore',
      },
      {
        id: 3,
        scopeId: 2,
        releaseId: 3,
        path: '/',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'innerHTML',
      },
      {
        id: 4,
        scopeId: 3,
        releaseId: 4,
        path: '/',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'innerHTML',
      },
    ]
    await this.createOrUpdate(seedList, ReleaseContentHistory, ['id'])
    const pluginList = [
      {
        id: 5,
        scopeId: 1,
        releaseId: 2,
        pluginId: 1,
        path: '/',
        content: '<link rel="stylesheet" href="http://localhost:3001/plugins/basic/plugin.css" />',
      },
      {
        id: 6,
        scopeId: 2,
        releaseId: 3,
        pluginId: 1,
        path: '/',
        content: '<link rel="stylesheet" href="http://localhost:3001/plugins/basic/plugin.css" />',
      },
    ]
    await this.createOrUpdate(pluginList, PluginContentHistory, ['id'])
  }
}

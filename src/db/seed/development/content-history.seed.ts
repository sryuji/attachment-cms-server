import { ReleaseContentHistory } from '../../entity/release-content-history.entity'
import { BaseSeed } from '../base.seed'

export default class ContentHistorySeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        scopeId: 1,
        releaseId: 1,
        path: '/',
        description: '説明を記述',
        selector: 'body > div',
        content: '<span>テスト</span>',
        action: 'innerHTML',
      },
      {
        scopeId: 1,
        releaseId: 2,
        path: '/',
        description: '説明を記述',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'insertBefore',
      },
      {
        scopeId: 2,
        releaseId: 3,
        path: '/',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'innerHTML',
      },
      {
        scopeId: 3,
        releaseId: 4,
        path: '/',
        selector: 'body > h1',
        content: 'タイトル',
        action: 'innerHTML',
      },
    ]
    await this.createOrUpdate(seedList, ReleaseContentHistory, ['id'])
  }
}

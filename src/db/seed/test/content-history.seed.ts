import { ContentHistory } from '../../entity/content-history.entity'
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
    await this.createOrUpdate(seedList, ContentHistory, ['id'])
  }
}

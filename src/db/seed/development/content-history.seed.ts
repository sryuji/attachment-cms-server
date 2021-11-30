import { ReleaseContentHistory } from '../../entity/release-content-history.entity'
import { BaseSeed } from '../base.seed'

export default class ContentHistorySeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        scopeId: 1,
        releaseId: 1,
        path: '/',
        description: '説明を記述. releaseId: 2',
        selector: '#test',
        content: '<span>#test</span>',
        action: 'innerHTML',
      },
      {
        scopeId: 1,
        releaseId: 2,
        path: '/',
        description: '説明を記述. releaseId: 2',
        selector: '#test',
        content: '<span>#test</span>',
        action: 'innerHTML',
      },
    ]
    await this.createOrUpdate(seedList, ReleaseContentHistory, ['id'])
  }
}

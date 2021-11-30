import { generateUUIDv4 } from '../../../util/math'
import { Release } from '../../entity/release.entity'
import { BaseSeed } from '../base.seed'

export default class ReleaseSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      { id: 1, scopeId: 1, name: '初めてのリリース', releasedAt: new Date() },
      {
        id: 2,
        scopeId: 2,
        name: 'Helpコンテンツを追加',
        releasedAt: null as Date,
        limitedReleaseToken: generateUUIDv4(),
        limitedReleaseTokenIssuedAt: new Date(),
      },
    ]
    await this.createOrUpdate(seedList, Release, ['id'])
  }
}

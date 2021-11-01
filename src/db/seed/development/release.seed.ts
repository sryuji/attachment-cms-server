import { Release } from '../../entity/release.entity'
import { BaseSeed } from '../base.seed'

export default class ReleaseSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      { id: 1, scopeId: 1, name: 'リリース済', releasedAt: new Date() },
      {
        id: 2,
        scopeId: 1,
        name: '2度目のリリースの作業中',
        releasedAt: null as Date,
        limitedReleaseToken: 'limitedReleaseToken',
        limitedReleaseTokenIssuedAt: new Date(),
      },
      { id: 3, scopeId: 1, name: 'リリース済', releasedAt: new Date() },
      { id: 4, scopeId: 2, name: 'リリース済', releasedAt: new Date() },
      {
        id: 5,
        scopeId: 3,
        name: '初リリースの作業中',
        releasedAt: null as Date,
        limitedReleaseToken: 'limitedReleaseToken',
        limitedReleaseTokenIssuedAt: new Date(),
      },
    ]
    await this.createOrUpdate(seedList, Release, ['id'])
  }
}

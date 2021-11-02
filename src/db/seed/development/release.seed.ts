import { Release } from '../../entity/release.entity'
import { BaseSeed } from '../base.seed'

export default class ReleaseSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      { id: 1, scopeId: 1, name: 'リリース済', releasedAt: new Date(2021, 9, 1) },
      {
        id: 2,
        scopeId: 1,
        name: '2度目のリリースの作業中',
        releasedAt: null as Date,
        limitedReleaseToken: 'limitedReleaseToken2',
        limitedReleaseTokenIssuedAt: new Date(),
      },
      { id: 3, scopeId: 2, name: 'リリース済', releasedAt: new Date(2021, 9, 10) },
      {
        id: 4,
        scopeId: 3,
        name: '初リリース作業中',
        releasedAt: null as Date,
        limitedReleaseToken: 'limitedReleaseToken4',
        limitedReleaseTokenIssuedAt: new Date(),
      },
    ]
    await this.createOrUpdate(seedList, Release, ['id'])
  }
}

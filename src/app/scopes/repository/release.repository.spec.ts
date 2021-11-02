import { compileModule, runSeeds } from '../../../../test/helper/orm.helper'
import AccountScopeSeed from '../../../db/seed/test/account-scope.seed'
import ReleaseSeed from '../../../db/seed/test/release.seed'
import ScopeSeed from '../../../db/seed/test/scope.seed'
import AccountSeed from '../../../db/seed/test/account.seed'
import { ReleaseRepository } from './release.repository'

describe('ReleaseRepository', () => {
  let repository: ReleaseRepository

  beforeAll(async () => {
    const app = await compileModule([ReleaseRepository])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed)
    repository = app.get<ReleaseRepository>(ReleaseRepository)
  })

  describe('#findLatestRelease', () => {
    it('return latest release', async () => {
      const [scopeId] = [1]
      const release = await repository.findLatestRelease(scopeId)
      expect(release.id).toEqual(2)
      expect(release.name).toEqual('2度目のリリースの作業中')
    })
  })

  describe('#findAll', () => {
    it('return releases of specified one scope', async () => {
      const [scopeId, page, per] = [1, 1, 1]
      const [releases, pager] = await repository.findAll(scopeId, page, per)
      expect(releases.length).toEqual(1)
      expect(pager.page).toEqual(1)
      expect(pager.per).toEqual(1)
      expect(pager.totalCount).toEqual(2)
      expect(releases[0].id).toEqual(2)
    })
  })

  describe('#findOneWithPager', () => {
    it('return one release with pager', async () => {
      const [releaseId] = [2]
      const [release, pager] = await repository.findOneWithPager(releaseId)
      expect(release.id).toEqual(2)
      expect(pager.page).toEqual(1)
      expect(pager.per).toEqual(1)
      expect(pager.totalCount).toEqual(2)
    })
  })
})

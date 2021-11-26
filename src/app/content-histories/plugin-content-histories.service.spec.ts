import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'
import { PluginContentHistoriesService } from './plugin-content-histories.service'
import PluginsSeed from '../../db/seed/test/plugin.seed'

describe('PluginContentHistoriesService', () => {
  let service: PluginContentHistoriesService
  let record: PluginContentHistory

  beforeAll(async () => {
    const app = await compileModule([PluginContentHistory], [PluginContentHistoriesService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, PluginsSeed)

    service = app.get<PluginContentHistoriesService>(PluginContentHistoriesService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  afterEach(async () => {
    if (record) {
      await PluginContentHistory.delete({ pluginId: record.pluginId })
      record = null
    }
  })

  describe('#create', () => {
    it('enables Plugin', async () => {
      record = await service.create({
        pluginId: 1,
        scopeId: 1,
        path: '/abc',
      })
      expect(record.id).toBeDefined()
      expect(record.scopeId).toEqual(1)
      expect(record.pluginId).toEqual(1)
      expect(record.releaseId).toBeNull()
      expect(record.selector).toEqual('body')
      expect(record.action).toEqual('insertChildBeforeEnd')
      expect(record.path).toEqual('/abc')
      expect(record.content).toBeDefined()
    })
  })

  describe('#deleteByPath', () => {
    beforeEach(async () => {
      record = await service.create({
        pluginId: 1,
        scopeId: 1,
        path: '/abc',
      })
    })
    it('disable Plugin', async () => {
      await service.deleteByPath({
        pluginId: record.pluginId,
        scopeId: record.scopeId,
        path: record.path,
      })
      expect(await PluginContentHistory.count()).toEqual(0)
    })
  })
})

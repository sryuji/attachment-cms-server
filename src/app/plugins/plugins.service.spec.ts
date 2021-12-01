import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import { PluginsService } from './plugins.service'
import { Plugin } from '../../db/entity/plugin.entity'
import { PluginFile } from '../../db/entity/plugin-file.entity'

describe('PluginsService', () => {
  let service: PluginsService
  let record: Plugin

  beforeAll(async () => {
    const app = await compileModule([Plugin], [PluginsService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed)

    service = app.get<PluginsService>(PluginsService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  afterEach(async () => {
    if (record) {
      await PluginFile.delete({})
      await Plugin.delete({})
      record = null
    }
  })

  describe('#createWithFiles', () => {
    it('creates', async () => {
      record = await service.createWithFiles({
        name: 'TEST',
        content: '<div>てすと</div>',
        pluginFiles: [{ kind: 'js', url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.js' }],
      })
      expect(record.id).toBeDefined()
      expect(record.name).toEqual('TEST')
      expect(record.content).toEqual('<div>てすと</div>')
      expect(await PluginFile.count()).toEqual(1)
      const file = record.pluginFiles[0]
      expect(file.id).toBeDefined()
      expect(file.kind).toEqual('js')
      expect(file.url).toBeDefined()
    })

    it('creates without content', async () => {
      record = await service.createWithFiles({
        name: 'TEST',
        pluginFiles: [{ kind: 'js', url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.js' }],
      })
      expect(record.id).toBeDefined()
      expect(record.name).toEqual('TEST')
      expect(record.content).toEqual('<script src="https://attachment-cms.dev/plugin/basic/plugin.xxx.js">')
      expect(await PluginFile.count()).toEqual(1)
      const file = record.pluginFiles[0]
      expect(file.id).toBeDefined()
      expect(file.kind).toEqual('js')
      expect(file.url).toBeDefined()
    })
  })

  describe('#updateWithFiles', () => {
    beforeEach(async () => {
      record = await service.createWithFiles({
        name: 'TEST',
        content: '<div>てすと</div>',
        pluginFiles: [{ kind: 'js', url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.js' }],
      })
    })

    it('updates', async () => {
      record = await service.createWithFiles({
        name: 'TEST2',
        content: '<div>てすと2</div>',
        pluginFiles: [
          {
            id: record.pluginFiles[0].id,
            kind: 'css',
            url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.css',
          },
        ],
      })
      expect(record.id).toBeDefined()
      expect(record.name).toEqual('TEST2')
      expect(record.content).toEqual('<div>てすと2</div>')
      expect(await PluginFile.count()).toEqual(1)
      const file = record.pluginFiles[0]
      expect(file.kind).toEqual('css')
    })
  })

  describe('#delete', () => {
    beforeEach(async () => {
      record = await service.createWithFiles({
        name: 'TEST',
        content: '<div>てすと</div>',
        pluginFiles: [{ kind: 'js', url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.js' }],
      })
    })

    it('deletes', async () => {
      await service.delete(record.id)
      expect(await Plugin.count()).toEqual(0)
      expect(await PluginFile.count()).toEqual(0)
    })
  })

  describe('#deleteFile', () => {
    beforeEach(async () => {
      record = await service.createWithFiles({
        name: 'TEST',
        content: '<div>てすと</div>',
        pluginFiles: [{ kind: 'js', url: 'https://attachment-cms.dev/plugin/basic/plugin.xxx.js' }],
      })
    })

    it('deletes', async () => {
      await service.deleteFile(record.pluginFiles[0].id)
      expect(await Plugin.count()).toEqual(1)
      expect(await PluginFile.count()).toEqual(0)
    })
  })
})

import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
import { ContentHistoriesService } from '../content-histories/content-histories.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { ForbiddenException } from '@nestjs/common'
import { ValidationsError } from '../../exception/validations.error'
import { Release } from '../../db/entity/release.entity'

describe('ContentHistoriesService', () => {
  let service: ContentHistoriesService
  let record: ContentHistory

  beforeAll(async () => {
    const app = await compileModule([ContentHistory], [ContentHistoriesService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, ContentHistorySeed)

    service = app.get<ContentHistoriesService>(ContentHistoriesService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  afterEach(async () => {
    if (record) {
      await ContentHistory.delete({ releaseId: record.releaseId })
      record = null
    }
  })

  describe('#create', () => {
    it('creates ContentHistory with text content', async () => {
      const releaseId = 2
      record = await service.create({
        releaseId,
        path: '/',
        selector: 'body > div',
        content: 'てすと',
        action: 'innerHTML',
      })
      expect(record.id).toBeDefined()
      expect(record.scopeId).toEqual(1)
      expect(record.content).toEqual(`<span id="acms-content-${record.id}">てすと</span>`)
    })

    it('creates ContentHistory with html content', async () => {
      const releaseId = 2
      record = await service.create({
        releaseId,
        path: '/',
        selector: 'body > div',
        content: '<div>test<span>てすと</span></div>',
        action: 'innerHTML',
      })
      expect(record.id).toBeDefined()
      expect(record.scopeId).toEqual(1)
      expect(record.content).toEqual(`<div id="acms-content-${record.id}">test<span>てすと</span></div>`)
    })

    it('can not create contentHistory of already release', async () => {
      const releaseId = 1
      await expect(service.create({ releaseId })).rejects.toThrow(ValidationsError)
    })
  })

  describe('#copyContentHistories', () => {
    let release: Release
    beforeEach(async () => {
      release = new Release({ name: 'test', scopeId: 2, sourceReleaseId: 3 })
      release = await release.save()
    })
    afterEach(async () => {
      if (release) {
        await ContentHistory.delete({ releaseId: release.id })
        await release.remove()
      }
    })
    it('copies ContentHistory', async () => {
      await service.copyContentHistories(release.sourceReleaseId, release.id)
      record = await ContentHistory.findOne({ where: { releaseId: release.id } })
      expect(record).toBeDefined()
      expect(record.id).toBeDefined()
      expect(record.sourceContentHistoryId).toBeDefined()
      const source = await ContentHistory.findOne(record.sourceContentHistoryId)
      expect(source.releaseId).toEqual(release.sourceReleaseId)
      expect(source.path).toEqual(record.path)
      expect(source.selector).toEqual(record.selector)
      expect(source.content).toEqual(record.content)
    })
  })

  describe('#update', () => {
    let record: ContentHistory

    it('updates ContentHistory with text content', async () => {
      record = await ContentHistory.findOne({ where: { scopeId: 3, releaseId: 4 } })
      record = await service.update(record.id, {
        path: '/',
        selector: 'body > div',
        content: 'てすと',
        action: 'innerHTML',
      })
      expect(record.content).toEqual(`<span id="acms-content-${record.id}">てすと</span>`)
    })

    it('updates ContentHistory with html content', async () => {
      record = await ContentHistory.findOne({ where: { scopeId: 3, releaseId: 4 } })
      record = await service.update(record.id, {
        path: '/',
        selector: 'body > div',
        content: '<div>1234567890</div>',
        action: 'innerHTML',
      })
      expect(record.content).toEqual(`<div id="acms-content-${record.id}">1234567890</div>`)
    })

    it('can not update releaseId', async () => {
      record = await ContentHistory.findOne({ where: { scopeId: 3, releaseId: 4 } })
      await expect(service.update(record.id, { releaseId: 1 })).rejects.toThrow(ForbiddenException)
    })

    it('can not update with released selector', async () => {
      record = await ContentHistory.findOne({ where: { scopeId: 1, releaseId: 1 } })
      await expect(service.update(record.id, { selector: 'body > div > div' })).rejects.toThrow(ForbiddenException)
    })
  })

  describe('#delete', () => {
    it('deletes ContentHistory', async () => {
      const [scopeId, releaseId] = [3, 4]
      record = await ContentHistory.findOne({ where: { scopeId, releaseId } })
      record = await service.delete(record.id)
      expect(record.id).toBeUndefined()
    })

    it('can not delete. because released', async () => {
      const contentHistoryId = 1
      await expect(service.delete(contentHistoryId)).rejects.toThrow(ForbiddenException)
    })
  })
})

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
    it('creates ContentHistory', async () => {
      const releaseId = 2
      record = await service.create({
        releaseId,
        path: '/',
        selector: 'body > div',
        content: 'test',
        action: 'innerHTML',
      })
      expect(record.id).toBeDefined()
      expect(record.scopeId).toEqual(1)
    })

    it('can not create. because released', async () => {
      const releaseId = 1
      expect(service.create({ releaseId })).rejects.toThrow(ValidationsError)
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
      console.log(release)
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

  describe('#delete', () => {
    it('deletes ContentHistory', async () => {
      const [scopeId, releaseId] = [3, 4]
      record = await ContentHistory.findOne({ where: { scopeId, releaseId } })
      record = await service.delete(record.id)
      expect(record.id).toBeUndefined()
    })

    it('can not delete. because released', async () => {
      const contentHistoryId = 1
      expect(service.delete(contentHistoryId)).rejects.toThrow(ForbiddenException)
    })
  })
})
import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import { ReleasesService } from './releases.service'
import { ReleaseRepository } from './repository/release.repository'
import ReleaseSeed from '../../db/seed/test/release.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
import { Release } from '../../db/entity/release.entity'
import { CreateReleaseDto } from './dto/release.dto'
import { ContentHistoriesService } from '../content-histories/content-histories.service'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { ValidationsError } from '../../exception/validations.error'
import { Scope } from '../../db/entity/scope.entity'
import { ForbiddenException } from '@nestjs/common'
import PluginsSeed from '../../db/seed/test/plugin.seed'
import { ReleaseContentHistory } from '../../db/entity/release-content-history.entity'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'

describe('ReleasesService', () => {
  let service: ReleasesService

  beforeAll(async () => {
    const app = await compileModule(
      [ReleaseRepository, ReleaseContentHistory, PluginContentHistory],
      [ReleasesService, ContentHistoriesService]
    )
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, PluginsSeed, ContentHistorySeed)

    service = app.get<ReleasesService>(ReleasesService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#create', () => {
    let record: Release

    afterEach(async () => {
      if (record) {
        await ContentHistory.delete({ releaseId: record.id })
        await record.remove()
        record = null
      }
    })

    it('throws ValidationsError. because not found Scope', async () => {
      const [scopeId] = [999]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: null }
      const count = await Release.count({ where: { scopeId } })
      await expect(service.create(dto)).rejects.toThrow(ValidationsError)
      const count2 = await Release.count({ where: { scopeId } })
      expect(count2).toEqual(count)
    })
    it('throws ValidationsError. because already exists new Release', async () => {
      const [scopeId] = [1]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: null }
      const count = await Release.count({ where: { scopeId } })
      await expect(service.create(dto)).rejects.toThrow(ValidationsError)
      const count2 = await Release.count({ where: { scopeId } })
      expect(count2).toEqual(count)
    })
    it('throws ValidationsError. Not found souce Release', async () => {
      const [scopeId] = [2]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: 999 }
      const count = await Release.count({ where: { scopeId } })
      await expect(service.create(dto)).rejects.toThrow(ValidationsError)
      const count2 = await Release.count({ where: { scopeId } })
      expect(count2).toEqual(count)
    })
    it('creates Release first time.', async () => {
      const [scopeId] = [4]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: null }
      record = await service.create(dto)
      expect(record.id).toBeDefined()
      expect(record.name).toEqual(dto.name)
      expect(record.scopeId).toEqual(dto.scopeId)
      expect(record.sourceReleaseId).toBeNull()
      expect(record.limitedReleaseToken).toBeDefined()
      expect(record.limitedReleaseTokenIssuedAt).toBeDefined()
    })
    it('creates Release based on previous release automatically.', async () => {
      const [scopeId] = [2]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: null }
      record = await service.create(dto)
      expect(record.id).toBeDefined()
      expect(record.name).toEqual(dto.name)
      expect(record.scopeId).toEqual(dto.scopeId)
      expect(record.sourceReleaseId).toEqual(3)
      expect(record.limitedReleaseToken).toBeDefined()
      expect(record.limitedReleaseTokenIssuedAt).toBeDefined()
    })
    it('creates Release based on previous release by specified previous release.', async () => {
      const [scopeId] = [2]
      const dto: CreateReleaseDto = { name: 'test', scopeId, sourceReleaseId: 3 }
      record = await service.create(dto)
      expect(record.id).toBeDefined()
      expect(record.name).toEqual(dto.name)
      expect(record.scopeId).toEqual(dto.scopeId)
      expect(record.sourceReleaseId).toEqual(dto.sourceReleaseId)
      expect(record.limitedReleaseToken).toBeDefined()
      expect(record.limitedReleaseTokenIssuedAt).toBeDefined()
    })
  })

  describe('#publish', () => {
    let record: Release

    beforeEach(async () => {
      record = await service.create({ name: 'test', scopeId: 4 })
    })

    afterEach(async () => {
      if (record) {
        await ContentHistory.delete({ releaseId: record.id })
        await Scope.update({ id: record.scopeId }, { defaultReleaseId: null })
        await record.remove()
        record = null
      }
    })

    describe('no contents', () => {
      it('can not publish', async () => {
        expect(service.publish(record.id, { id: record.id, releasedAt: new Date() })).rejects.toThrowError()
      })
    })

    describe('exists contents', () => {
      beforeEach(async () => {
        await new ReleaseContentHistory({
          releaseId: record.id,
          scopeId: record.scopeId,
          path: '/',
          selector: '#test > p',
          action: 'remove',
        }).save()
      })
      it('publishes release', async () => {
        record = await service.publish(record.id, { id: record.id, releasedAt: new Date() })
        expect(record.releasedAt).toBeDefined()
        const scope = await Scope.findOne(record.scopeId)
        expect(scope.defaultReleaseId).toEqual(record.id)
      })
    })
  })

  describe('#rollback', () => {
    let record: Release

    beforeEach(async () => {
      record = await service.create({ name: 'test', scopeId: 4 })
      await new ReleaseContentHistory({
        releaseId: record.id,
        scopeId: record.scopeId,
        path: '/',
        selector: '#test > p',
        action: 'remove',
      }).save()
    })

    afterEach(async () => {
      if (record) {
        ContentHistory.delete({ releaseId: record.id })
        await record.remove()
        record = null
      }
    })

    it('can not released', async () => {
      await service.rollback(record.id).catch((err) => Promise.resolve())
      expect(record.releasedAt).toBeDefined()
      expect(record.limitedReleaseToken).toBeDefined()
      expect(record.limitedReleaseTokenIssuedAt).toBeDefined()
      const scope = await Scope.findOne(record.scopeId)
      expect(scope.defaultReleaseId).toBeNull()
    })
    it('can rollback', async () => {
      record = await service.publish(record.id, { id: record.id })
      record = await service.rollback(record.id)
      expect(record.releasedAt).toBeNull()
      expect(record.limitedReleaseToken).toBeDefined()
      expect(record.limitedReleaseTokenIssuedAt).toBeDefined()
      const scope = await Scope.findOne(record.scopeId)
      expect(scope.defaultReleaseId).toBeNull()
    })
  })

  describe('#delete', () => {
    let release: Release = null
    let contents: ContentHistory[] = []

    afterEach(async () => {
      release && (await release.save())
      contents.length > 0 && (await Promise.all(contents.map((r) => r.save())))
    })

    it('deletes Release before release', async () => {
      const releaseId = 2
      release = await Release.findOne(releaseId)
      expect(release.releasedAt).toBeNull()

      contents = await ContentHistory.find({ where: { releaseId } })
      expect(contents.length).toEqual(2)
      expect(contents[0].type).toEqual('ReleaseContentHistory')
      expect(contents[1].type).toEqual('PluginContentHistory')

      await service.delete(releaseId)
      expect(await ContentHistory.count({ where: { releaseId } })).toEqual(0)
    })

    it('can not deletes released', async () => {
      const releaseId = 1
      release = await Release.findOne(releaseId)
      expect(release.releasedAt).toBeDefined()
      await expect(service.delete(releaseId)).rejects.toThrow(ForbiddenException)
      expect(await ContentHistory.count({ where: { releaseId } })).toEqual(1)
    })
  })
})

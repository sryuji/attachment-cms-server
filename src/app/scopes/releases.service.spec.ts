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

describe('ReleasesService', () => {
  let service: ReleasesService

  beforeAll(async () => {
    const app = await compileModule([ReleaseRepository, ContentHistory], [ReleasesService, ContentHistoriesService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, ContentHistorySeed)

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

    it('publishes release', async () => {
      record = await service.publish(record.id, { id: record.id, releasedAt: new Date() })
      expect(record.releasedAt).toBeDefined()
      const scope = await Scope.findOne(record.scopeId)
      expect(scope.defaultReleaseId).toEqual(record.id)
    })
  })

  describe('#delete', () => {
    it('deletes Release before release', async () => {
      const releaseId = 2
      const record = await service.delete(releaseId)
      expect(record.id).toBeUndefined()
    })

    it('can not deletes released', async () => {
      const releaseId = 1
      await expect(service.delete(releaseId)).rejects.toThrow(ForbiddenException)
    })
  })
})

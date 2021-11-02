import { getConnection } from 'typeorm'
import { compileModule, runSeeds } from '../../../test/helper/orm.helper'
import AccountScopeSeed from '../../db/seed/test/account-scope.seed'
import ScopeSeed from '../../db/seed/test/scope.seed'
import AccountSeed from '../../db/seed/test/account.seed'
import ReleaseSeed from '../../db/seed/test/release.seed'
import ContentHistorySeed from '../../db/seed/test/content-history.seed'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Release } from '../../db/entity/release.entity'
import { ContentsService } from './contents.service'
import { ReleaseRepository } from '../scopes/repository/release.repository'
import { Scope } from '../../db/entity/scope.entity'

describe('ContentsService', () => {
  let service: ContentsService

  beforeAll(async () => {
    const app = await compileModule([ContentHistory, Scope, ReleaseRepository], [ContentsService])
    await runSeeds(AccountSeed, ScopeSeed, AccountScopeSeed, ReleaseSeed, ContentHistorySeed)

    service = app.get<ContentsService>(ContentsService)
  })

  afterAll(async () => {
    await getConnection().close()
  })

  describe('#searchLimitedReleaseTarget', () => {
    it('gets ContentHistory List before released', async () => {
      const release = await Release.findOne(4)
      const contents = await service.searchLimitedReleaseTarget(release.limitedReleaseToken)
      expect(contents.length).toEqual(1)
      expect(contents[0].id).toEqual(4)
    })

    it('raise forbidden error. because invalid limited token', async () => {
      const limitedReleaseToken = 'invalid token'
      await expect(service.searchLimitedReleaseTarget(limitedReleaseToken)).rejects.toThrow(ForbiddenException)
    })
  })
  describe('#searchReleaseTarget', () => {
    it('gets ContentHistory List  after released', async () => {
      const scope = await Scope.findOne(1)
      const token = scope.token
      const contents = await service.searchReleaseTarget(token)
      expect(contents.length).toEqual(1)
      expect(contents[0].id).toEqual(1)
    })

    it('raise unauthorized error. because invalid token', async () => {
      const token = 'invalid token'
      await expect(service.searchReleaseTarget(token)).rejects.toThrow(UnauthorizedException)
    })

    it('raise forbidden error. because no release', async () => {
      const scope = await Scope.findOne(3)
      const token = scope.token
      await expect(service.searchReleaseTarget(token)).rejects.toThrow(ForbiddenException)
    })
  })
})

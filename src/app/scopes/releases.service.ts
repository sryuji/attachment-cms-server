import { ForbiddenException, Injectable } from '@nestjs/common'
import { Release } from '../../db/entity/release.entity'
import { PublishReleaseDto } from './dto/release.dto'
import { BaseService } from '../base/base.service'
import { Scope } from '../../db/entity/scope.entity'
import { ValidationsError } from '../../exception/validations.error'
import { ContentHistoriesService } from '../content-histories/content-histories.service'
import { ReleaseRepository } from './repository/release.repository'
import { generateUUIDv4 } from '../../util/math'
import { IsNull } from 'typeorm'
import { ReleaseContentHistory } from '../../db/entity/release-content-history.entity'
import { ContentHistory } from '../../db/entity/content-history.entity'

@Injectable()
export class ReleasesService extends BaseService<Release> {
  constructor(
    protected readonly repository: ReleaseRepository, //override property
    private readonly contentHistoriesService: ContentHistoriesService
  ) {
    super(repository, Release)
  }

  async create(dto: Partial<Release>): Promise<Release> {
    const scope = await Scope.findOne(dto.scopeId)
    if (!scope) throw new ValidationsError([`Scopeが存在しません. scopeID: ${dto.scopeId}`])
    await this.checkUnreleased(scope.id)

    dto = await this.resolveSourceRelease(scope.id, dto)
    dto.limitedReleaseToken = generateUUIDv4()
    dto.limitedReleaseTokenIssuedAt = new Date()

    let record = new Release(dto)
    return this.transaction('SERIALIZABLE', async (manager) => {
      record = await manager.save(Release, record)
      if (record.sourceReleaseId)
        await this.contentHistoriesService.copyContentHistories(record.sourceReleaseId, record.id, manager)
      return record
    })
  }

  private async checkUnreleased(scopeId: number) {
    const unrelease = await Release.findOne({ where: { scopeId, releasedAt: IsNull() } })
    if (unrelease) throw new ValidationsError(['既に新しいリリースが存在します'])
  }

  private async resolveSourceRelease(scopeId: number, dto: Partial<Release>) {
    if (!dto.sourceReleaseId) {
      const sourceRelease = await this.repository.findLatestRelease(scopeId)
      dto.sourceReleaseId = sourceRelease && sourceRelease.id
    } else {
      const sourceRelease = await this.repository.findOne(dto.sourceReleaseId)
      if (!sourceRelease)
        throw new ValidationsError([`指定のリリース予定が存在しません. sourceReleaseId: ${dto.sourceReleaseId}`])
    }
    return dto
  }

  async publish(id: number, dto: PublishReleaseDto): Promise<Release> {
    const contentCount = await ReleaseContentHistory.count({ where: { releaseId: id } })
    if (contentCount === 0)
      throw new ValidationsError([`指定のリリースにコンテンツが存在しないため、リリースできません.`])

    dto.releasedAt ||= new Date()
    return await this.transaction(async (manager) => {
      const record = await this.update(id, { ...dto, limitedReleaseToken: null, limitedReleaseTokenIssuedAt: null })
      const scope = await record.scope
      scope.defaultReleaseId = record.id
      await scope.save()
      return record
    })
  }

  async rollback(id: number): Promise<Release> {
    const release = await Release.findOne(id)
    if (!release || !release.releasedAt)
      throw new ValidationsError(['リリース済でないとリリースの取り止めはできません。'])

    release.limitedReleaseToken = generateUUIDv4()
    release.limitedReleaseTokenIssuedAt = new Date()
    release.releasedAt = null
    release.rollbackedAt = new Date()
    return await this.transaction(async (manager) => {
      const record = await this.update(id, release)
      const scope = await record.scope
      scope.defaultReleaseId = null
      await scope.save()
      return record
    })
  }

  async delete(id: number): Promise<Release> {
    const release = await Release.findOne(id)
    if (!release || release.releasedAt) throw new ForbiddenException()
    return this.transaction(async (manager) => {
      await ContentHistory.delete({ releaseId: id })
      return await release.remove()
    })
  }
}

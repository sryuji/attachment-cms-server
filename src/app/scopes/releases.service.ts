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

    return this.transaction(async (manager) => {
      const record = await super.create(dto)
      if (record.sourceReleaseId)
        await this.contentHistoriesService.copyContentHistories(record.sourceReleaseId, record.id)
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
    return await this.transaction(async (manager) => {
      const record = await this.update(id, { ...dto, limitedReleaseToken: null, limitedReleaseTokenIssuedAt: null })
      const scope = await record.scope
      scope.defaultReleaseId = record.id
      await scope.save()
      return record
    })
  }

  async delete(id: number): Promise<Release> {
    const release = await Release.findOne(id)
    if (!release || release.releasedAt) throw new ForbiddenException()
    return this.transaction(async (manager) => {
      await this.contentHistoriesService.deleteBy({ releaseId: id })
      return await release.remove()
    })
  }
}

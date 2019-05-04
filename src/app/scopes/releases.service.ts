import { Injectable } from '@nestjs/common'
import { Release } from '../../db/entity/release.entity'
import { PublishReleaseDto } from './dto/release.dto'
import { BaseService } from '../base/base.service'
import { Scope } from '../../db/entity/scope.entity'
import { ValidationsError } from '../../exception/validations.error'
import { ContentHistoriesService } from '../content-histories/content-histories.service'
import { ReleaseRepository } from './repository/release.repository'

@Injectable()
export class ReleasesService extends BaseService<Release> {
  constructor(
    protected readonly repository: ReleaseRepository, //override property
    private readonly contentHistoriesService: ContentHistoriesService,
  ) {
    super(repository, Release)
  }

  async create(dto: Partial<Release>): Promise<Release> {
    const scope = await Scope.findOne(dto.scopeId)
    if (!scope) throw new ValidationsError([`Scopeが存在しません. scopeID: ${dto.scopeId}`])
    if (!dto.sourceReleaseId) {
      const sourceRelease = await this.repository.findLatestRelease(scope.id)
      dto.sourceReleaseId = sourceRelease && sourceRelease.id
    } else {
      const sourceRelease = await this.repository.findOne(dto.sourceReleaseId)
      if (!sourceRelease)
        throw new ValidationsError([`指定のリリース予定が存在しません. sourceReleaseId: ${dto.sourceReleaseId}`])
    }
    return await this.repository.manager.transaction(async manager => {
      const record = await super.create(dto)
      await this.contentHistoriesService.copyContentHistories(record.sourceReleaseId, record.id)
      return record
    })
  }

  async publish(id: number, dto: PublishReleaseDto): Promise<Release> {
    return await this.repository.manager.transaction(async manager => {
      const record = await this.update(id, dto)
      const scope = await record.scope
      scope.defaultReleaseId = record.id
      await scope.save()
      return record
    })
  }
}

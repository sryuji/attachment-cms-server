import { Injectable, OnModuleInit, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { ContentHistory } from '../..//db/entity/content-history.entity'
import { ReleasesService } from '../scopes/releases.service'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class ContentHistoriesService extends BaseService<ContentHistory> implements OnModuleInit {
  protected releasesService: ReleasesService

  constructor(
    @InjectRepository(ContentHistory)
    protected readonly repository: Repository<ContentHistory>,
    private readonly moduleRef: ModuleRef
  ) {
    super(repository, ContentHistory)
  }

  onModuleInit() {
    // https://docs.nestjs.com/fundamentals/circular-dependency#module-reference
    this.releasesService = this.moduleRef.get(ReleasesService, { strict: false })
  }

  async create(dto: Partial<ContentHistory>): Promise<ContentHistory> {
    const release = await this.releasesService.fetch(dto.releaseId)
    dto.scopeId = release.scopeId
    return super.create(dto)
  }

  async copyContentHistories(sourceReleaseId: number, destReleaseId: number): Promise<void> {
    const hists = await this.repository.find({ where: { sourceReleaseId } })
    if (hists.length === 0) return
    const newHists = hists
      .filter((r) => !r.sourceContentHistoryId || !r.inactive)
      .map((h) => ({ ...h, id: null, releaseId: destReleaseId }))
    await this.repository.insert(newHists)
  }

  async delete(id: number): Promise<ContentHistory> {
    const record = await this.fetch(id)
    if (record.release.releasedAt) throw new ForbiddenException('リリース済のため削除できません。')
    if (record.sourceContentHistoryId) {
      record.inactive = true
      return record.save()
    } else {
      return await record.remove()
    }
  }
}

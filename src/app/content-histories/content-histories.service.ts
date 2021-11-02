import { Injectable, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { ContentHistory } from '../..//db/entity/content-history.entity'
import { ValidationsError } from '../../exception/validations.error'
import { Release } from '../../db/entity/release.entity'

@Injectable()
export class ContentHistoriesService extends BaseService<ContentHistory> {
  constructor(
    @InjectRepository(ContentHistory)
    protected readonly repository: Repository<ContentHistory>
  ) {
    super(repository, ContentHistory)
  }

  async create(dto: Partial<ContentHistory>): Promise<ContentHistory> {
    const release = await Release.findOne(dto.releaseId)
    if (release.releasedAt) throw new ValidationsError(['リリース済のため登録できません。'])
    dto.scopeId = release.scopeId
    return super.create(dto)
  }

  async copyContentHistories(sourceReleaseId: number, destReleaseId: number): Promise<void> {
    if (!sourceReleaseId || !destReleaseId)
      throw new Error(`Need sourceReleaseId (${sourceReleaseId}) and destReleaseId  (${destReleaseId}) .`)
    const hists = await this.repository.find({ where: { releaseId: sourceReleaseId } })
    if (hists.length === 0) return
    const newHists = hists.map((h) => ({ ...h, id: null, releaseId: destReleaseId, sourceContentHistoryId: h.id }))
    await this.repository.insert(newHists)
  }

  async delete(id: number): Promise<ContentHistory> {
    const record = await this.fetch(id)
    const release = await record.release
    if (release.releasedAt) throw new ForbiddenException('リリース済のため削除できません。')
    return await record.remove()
  }
}

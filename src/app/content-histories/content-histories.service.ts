import { Injectable, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { ValidationsError } from '../../exception/validations.error'
import { Release } from '../../db/entity/release.entity'
import { isUndefined } from '../../util/object'
import { normalizeContent, normalizePath } from './content-histories.helper'
import { ReleaseContentHistory } from '../../db/entity/release-content-history.entity'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'

@Injectable()
export class ContentHistoriesService extends BaseService<ContentHistory> {
  constructor(
    @InjectRepository(ContentHistory)
    protected readonly repository: Repository<ContentHistory>
  ) {
    super(repository, ContentHistory)
  }

  async create(dto: Partial<ReleaseContentHistory>): Promise<ReleaseContentHistory> {
    const release = await Release.findOne(dto.releaseId)
    if (release.releasedAt) throw new ValidationsError(['リリース済のため追加できません。'])

    dto.scopeId = release.scopeId
    let record = new ReleaseContentHistory(dto)
    record.isUpdated = false
    return this.transaction('READ COMMITTED', async (manager) => {
      record = await manager.save<ReleaseContentHistory>(record)
      record = this.normalizeContentHistroy(record)
      record = await manager.save<ReleaseContentHistory>(record)
      return record
    })
  }

  async copyContentHistories(sourceReleaseId: number, destReleaseId: number, manager?: EntityManager): Promise<void> {
    if (!sourceReleaseId || !destReleaseId)
      throw new Error(`Need sourceReleaseId (${sourceReleaseId}) and destReleaseId  (${destReleaseId}) .`)
    const hists = await ContentHistory.find({ where: { releaseId: sourceReleaseId } })
    if (hists.length === 0) return

    const newReleaseContentHistories: ReleaseContentHistory[] = []
    const newPluginContentHistories: PluginContentHistory[] = []
    hists.forEach((h) => {
      const initialAttributes = {
        ...h,
        id: null as number,
        releaseId: destReleaseId,
        sourceContentHistoryId: h.id,
        isUpdated: false,
      }
      switch (h.type) {
        case 'PluginContentHistory':
          newPluginContentHistories.push(new PluginContentHistory(initialAttributes))
          break
        case 'ReleaseContentHistory':
          newReleaseContentHistories.push(new ReleaseContentHistory(initialAttributes))
          break
        default:
          throw new Error(`Bug. invalid type of contentHistory. sourceId: ${h.id}, type: ${h.type}`)
      }
    })
    const procedure = async (m: EntityManager): Promise<null> => {
      await m.insert(ReleaseContentHistory, newReleaseContentHistories)
      await m.insert(PluginContentHistory, newPluginContentHistories)
      return null
    }
    // HACK: managerの受け渡ししてのtransaction統一をやめたい
    manager ? await procedure(manager) : await this.transaction('READ COMMITTED', procedure)
  }

  async update(id: number, dto: Partial<ReleaseContentHistory>): Promise<ReleaseContentHistory> {
    let contentHistory = await ReleaseContentHistory.findOneOrFail(id)
    const release = await Release.findOneOrFail(contentHistory.releaseId)
    if (
      (dto.scopeId && contentHistory.scopeId !== dto.scopeId) ||
      (dto.releaseId && contentHistory.releaseId !== dto.releaseId)
    ) {
      throw new ForbiddenException([`scopeIdとreleaseIdの更新要求は行えません。`])
    }
    if (this.canUpdate(release, contentHistory, dto)) {
      contentHistory = Object.assign(contentHistory, dto)
      contentHistory = this.normalizeContentHistroy(contentHistory)
      contentHistory.isUpdated = true
      return contentHistory.save()
    }
    throw new ForbiddenException(['リリース済のため、更新できない項目があります。'])
  }

  async delete(id: number): Promise<ReleaseContentHistory> {
    const record = await this.fetch(id)
    const release = await record.release
    if (release.releasedAt) throw new ForbiddenException('リリース済のため削除できません。')
    return await record.remove()
  }

  private canUpdate(
    release: Release,
    contentHistory: ReleaseContentHistory,
    dto: Partial<ReleaseContentHistory>
  ): boolean {
    if (!release.releasedAt) return true
    return (
      (isUndefined(dto.path) || contentHistory.path === dto.path) &&
      (isUndefined(dto.selector) || contentHistory.selector === dto.selector) &&
      (isUndefined(dto.action) || contentHistory.action === dto.action)
    )
  }

  private normalizeContentHistroy(dto: ReleaseContentHistory): ReleaseContentHistory {
    dto.path = normalizePath(dto.path)
    dto.selector = dto.selector.trim()
    dto.content = normalizeContent(dto.id, dto.content)
    return dto
  }
}

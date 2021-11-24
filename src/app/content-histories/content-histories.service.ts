import { Injectable, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../base/base.service'
import { ContentHistory } from '../..//db/entity/content-history.entity'
import { ValidationsError } from '../../exception/validations.error'
import { Release } from '../../db/entity/release.entity'
import { isUndefined } from '../../util/object'
import { ElementType, parseDocument } from 'htmlparser2'
import render from 'dom-serializer'
import { Document, Element, isTag, isText } from 'domhandler'

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
    if (release.releasedAt) throw new ValidationsError(['リリース済のため追加できません。'])

    dto.scopeId = release.scopeId
    let record: ContentHistory = new ContentHistory(dto)
    return this.transaction('READ COMMITTED', async (manager) => {
      record = await manager.save<ContentHistory>(record)
      record = this.normalizeContentHistroy(record)
      await manager.save<ContentHistory>(record)
      return record
    })
  }

  async copyContentHistories(sourceReleaseId: number, destReleaseId: number): Promise<void> {
    if (!sourceReleaseId || !destReleaseId)
      throw new Error(`Need sourceReleaseId (${sourceReleaseId}) and destReleaseId  (${destReleaseId}) .`)
    const hists = await this.repository.find({ where: { releaseId: sourceReleaseId } })
    if (hists.length === 0) return
    const newHists = hists.map((h) => ({ ...h, id: null, releaseId: destReleaseId, sourceContentHistoryId: h.id }))
    await this.repository.insert(newHists)
  }

  async update(id: number, dto: Partial<ContentHistory>): Promise<ContentHistory> {
    let contentHistory = await ContentHistory.findOneOrFail(id)
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
      return contentHistory.save()
    }
    throw new ForbiddenException(['リリース済のため、更新できない項目があります。'])
  }

  async delete(id: number): Promise<ContentHistory> {
    const record = await this.fetch(id)
    const release = await record.release
    if (release.releasedAt) throw new ForbiddenException('リリース済のため削除できません。')
    return await record.remove()
  }

  private canUpdate(release: Release, contentHistory: ContentHistory, dto: Partial<ContentHistory>): boolean {
    if (!release.releasedAt) return true
    return (
      (isUndefined(dto.path) || contentHistory.path === dto.path) &&
      (isUndefined(dto.selector) || contentHistory.selector === dto.selector) &&
      (isUndefined(dto.action) || contentHistory.action === dto.action)
    )
  }

  private normalizeContentHistroy(dto: ContentHistory): ContentHistory {
    dto.path = this.normalizePath(dto.path)
    dto.selector = dto.selector.trim()
    dto.content = this.normalizeContent(dto.id, dto.content)
    return dto
  }

  private normalizePath(path: string): string {
    path = path.trim()
    path = path.replace(/\/+/g, '/')
    if (!path.startsWith('/')) path = `/${path}`
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1)
    }
    return path
  }

  private normalizeContent(id: number, content: string): string {
    const document: Document = parseDocument(content)
    const htmlId = `acms-content-${id}`
    let rootNode = document.firstChild
    if (isTag(rootNode)) {
      rootNode.attribs['id'] = htmlId
    } else if (isText(rootNode)) {
      rootNode = new Element('span', { id: htmlId }, [rootNode], ElementType.Tag)
    } else {
      throw new Error('Bug')
    }
    // NOTE: render時、defaultでtagや日本語をencodeしてしまうのでfalse
    return render(rootNode, { decodeEntities: false })
  }
}

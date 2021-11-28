import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PluginContentHistory } from '../../db/entity/plugin-content-history.entity'
import { Plugin } from '../../db/entity/plugin.entity'
import { BaseService } from '../base/base.service'
import { normalizeContent, normalizePath } from './content-histories.helper'
import { EnablePluginDto } from './dto/enable-plugin.dto'

@Injectable()
export class PluginContentHistoriesService extends BaseService<PluginContentHistory> {
  constructor(
    @InjectRepository(PluginContentHistory)
    protected readonly repository: Repository<PluginContentHistory>
  ) {
    super(repository, PluginContentHistory)
  }

  async create(dto: EnablePluginDto): Promise<PluginContentHistory> {
    const plugin = await Plugin.findOneOrFail(dto.pluginId)
    const path = normalizePath(dto.path)
    const uniqueKeys = { path, scopeId: dto.scopeId, pluginId: dto.pluginId, releaseId: dto.releaseId }
    return this.transaction('READ COMMITTED', async (manager) => {
      // NOTE: タイミング悪く複数作ってしまっても許容. deleteByPathで一括削除されるため
      let record = await PluginContentHistory.findOne<PluginContentHistory>({ where: uniqueKeys })
      record = new PluginContentHistory(uniqueKeys)
      record.description = plugin.name
      record = await manager.save<PluginContentHistory>(record)
      record.content = normalizeContent(record.id, plugin.content)
      return await manager.save<PluginContentHistory>(record)
    })
  }

  async deleteByPath(dto: EnablePluginDto): Promise<void> {
    const path = normalizePath(dto.path)
    await PluginContentHistory.delete({ path, scopeId: dto.scopeId, pluginId: dto.pluginId, releaseId: dto.releaseId })
  }
}

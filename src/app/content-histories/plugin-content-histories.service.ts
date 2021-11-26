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
    const plugin = await Plugin.findOne(dto.pluginId)
    let record = new PluginContentHistory({
      scopeId: dto.scopeId,
      path: normalizePath(dto.path),
      description: plugin.name,
      pluginId: plugin.id,
    })
    return this.transaction('READ COMMITTED', async (manager) => {
      record = await manager.save<PluginContentHistory>(record)
      record.content = normalizeContent(record.id, plugin.content)
      return await manager.save<PluginContentHistory>(record)
    })
  }

  async deleteByPath(dto: EnablePluginDto): Promise<void> {
    const path = dto.path.trim()
    await PluginContentHistory.delete({ path, scopeId: dto.scopeId, pluginId: dto.pluginId })
  }
}

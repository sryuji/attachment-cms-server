import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PluginFile } from '../../db/entity/plugin-file.entity'
import { Plugin } from '../../db/entity/plugin.entity'
import { BaseService } from '../base/base.service'
import { PluginDto } from './dto/plugin.dto'

@Injectable()
export class PluginsService extends BaseService<Plugin> {
  constructor(
    @InjectRepository(Plugin)
    protected readonly repository: Repository<Plugin>
  ) {
    super(repository, Plugin)
  }

  async saveWithFiles(dto: PluginDto): Promise<Plugin> {
    dto.content = this.buildContent(dto, dto.pluginFiles)
    let record = new Plugin(dto)
    return this.transaction('READ COMMITTED', async (manager) => {
      record = await manager.save(record)
      record.pluginFiles = await Promise.all(
        record.pluginFiles.map((r) => manager.save(new PluginFile({ ...r, pluginId: record.id })))
      )
      return record
    })
  }

  private buildContent(dto: PluginDto, files: Partial<PluginFile>[]) {
    if (dto.content) return dto.content

    const buildJavascriptTemplate = (file: Partial<PluginFile>) => `<script src="${file.url}">`
    const buildStylesheetTemplate = (file: Partial<PluginFile>) => `<link rel="stylesheet" href="${file.url}" />`
    let content = ''
    files.forEach((file: Partial<PluginFile>) => {
      content +=
        file.kind === 'css' ? buildStylesheetTemplate(file) : file.kind === 'js' ? buildJavascriptTemplate(file) : ''
    })
    return content
  }

  async delete(id: number): Promise<Plugin> {
    const record = await Plugin.findOneOrFail(id)
    const fileIds = await (await PluginFile.find({ select: ['id'], where: { pluginId: record.id } })).map((r) => r.id)
    return this.transaction('READ COMMITTED', async (manager) => {
      await manager.delete(PluginFile, fileIds)
      await manager.delete(Plugin, id)
      return record
    })
  }

  async deleteFile(id: number): Promise<PluginFile> {
    const record = await PluginFile.findOneOrFail(id)
    return record.remove()
  }
}

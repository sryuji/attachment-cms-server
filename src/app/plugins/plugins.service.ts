import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PluginFile } from '../../db/entity/plugin-file.entity'
import { Plugin } from '../../db/entity/plugin.entity'
import { BaseService } from '../base/base.service'
import { PluginDto } from './dto/plugin.dto'

const buildJavascriptTemplate = (file: Partial<PluginFile>) => `<script src="${file.url}">`
const buildStylesheetTemplate = (file: Partial<PluginFile>) => `<link rel="stylesheet" href="${file.url}" />`

@Injectable()
export class PluginsService extends BaseService<Plugin> {
  constructor(
    @InjectRepository(Plugin)
    protected readonly repository: Repository<Plugin>
  ) {
    super(repository, Plugin)
  }

  async createWithFiles(dto: PluginDto): Promise<Plugin> {
    dto.content = this.buildContent(dto, dto.pluginFiles)
    let record = new Plugin(dto)
    return this.transaction('READ COMMITTED', async (manager) => {
      record = await manager.save(record)
      if (!dto.pluginFiles || dto.pluginFiles.length === 0) return record

      record.pluginFiles = await Promise.all(
        dto.pluginFiles.map((r) => {
          const file = new PluginFile({ ...r, pluginId: record.id })
          return manager.save(file)
        })
      )
      return record
    })
  }

  async updateWithFiles(dto: PluginDto): Promise<Plugin> {
    let files = await PluginFile.find({ where: { pluginId: dto.id } })

    return this.transaction('READ COMMITTED', async (manager) => {
      if (dto.pluginFiles && dto.pluginFiles.length > 0) {
        await Promise.all(
          dto.pluginFiles.map((r) => {
            let file = files.find((f) => f.id === r.id)
            file = file ? Object.assign(file, r) : new PluginFile({ ...r, pluginId: record.id })
            return manager.save(file)
          })
        )
      }
      files = await PluginFile.find({ where: { pluginId: dto.id } })
      dto.content = this.buildContent(dto, files)
      const record = await manager.save(new Plugin(dto))
      record.pluginFiles = files
      return record
    })
  }

  private buildContent(dto: PluginDto, files: Partial<PluginFile>[]): string {
    if (dto.content) return dto.content
    if (!files || files.length === 0) return null

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

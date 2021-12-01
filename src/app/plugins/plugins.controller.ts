import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_200, RESPONSE_201, RESPONSE_204 } from '../../constant/swagger.constant'
import { Plugin } from '../../db/entity/plugin.entity'
import { RequiredSuper } from '../../decorator/required-super.decorator'
import { BaseController } from '../base/base.controller'
import { PluginForm } from './dto/plugin.form'
import { PluginsService } from './plugins.service'
import { PluginSerializer } from './serializer/plugin.serializer'
import { PluginsSerializer } from './serializer/plugins.serializer'

@ApiTags('プラグイン')
@Controller('plugins')
export class PluginsController extends BaseController {
  constructor(private readonly pluginsService: PluginsService) {
    super()
  }

  @ApiOperation({ summary: 'プラグインの登録' })
  @ApiResponse(RESPONSE_201)
  @Post()
  @RequiredSuper()
  async create(@Body() payload: PluginForm): Promise<PluginSerializer> {
    const plugin = await this.pluginsService.createWithFiles(payload.plugin)
    return new PluginSerializer().serialize({ plugin })
  }

  @ApiOperation({
    summary: 'プラグインの更新',
  })
  @ApiResponse(RESPONSE_204)
  @Patch(':id')
  @HttpCode(204)
  @RequiredSuper()
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: PluginForm): Promise<PluginSerializer> {
    const dto = payload.plugin
    if (dto.id !== id) throw new ForbiddenException()
    const plugin = await this.pluginsService.updateWithFiles(dto)
    return new PluginSerializer().serialize({ plugin })
  }

  @ApiOperation({
    summary: 'プラグインの削除',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @RequiredSuper()
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.pluginsService.delete(id)
  }

  @ApiOperation({
    summary: 'プラグインのファイルを削除',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id/files/:fileId')
  @HttpCode(204)
  @RequiredSuper()
  async deleteFile(
    @Param('id', new ParseIntPipe()) id: number,
    @Param('fileId', new ParseIntPipe()) fileId: number
  ): Promise<void> {
    await this.pluginsService.deleteFile(id)
  }

  @ApiOperation({ summary: 'プラグインの一覧' })
  @ApiResponse(RESPONSE_200)
  @Get()
  async findAll(): Promise<PluginsSerializer> {
    const plugins = await Plugin.find({
      relations: ['pluginFiles'],
      order: { id: 'ASC' },
    })
    return new PluginsSerializer().serialize({ plugins })
  }
}

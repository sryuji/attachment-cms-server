import { Controller, Body, Post, Delete, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_204, RESPONSE_201 } from '../../constant/swagger.constant'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { ContentHistory } from '../../db/entity/content-history.entity'
import { PluginContentHistoriesService } from './plugin-content-histories.service'
import { EnablePluginForm } from './dto/enable-plugin.form'
import { PluginContentHistorySerializer } from './serializer/plugin-content-history.serializer'

@ApiTags('Path別にプラグインの有効無効化')
@Controller('plugin-content-histories')
export class PluginContentHistoriesController extends BaseController {
  constructor(private readonly service: PluginContentHistoriesService) {
    super()
  }

  @ApiOperation({ summary: 'Path別にプラグインの有効化' })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.scopeId)
  async create(@Body() payload: EnablePluginForm): Promise<PluginContentHistorySerializer> {
    const record = await this.service.create(payload.enablePlugin)
    return new PluginContentHistorySerializer().serialize({
      contentHistory: record,
    })
  }

  @ApiOperation({ summary: 'Path別にプラグインの無効化' })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @ScopeGetter(({ body }) => body.scopeId)
  @HttpCode(204)
  @ScopeGetter(({ params }) => ContentHistory.findOne(params.id).then((r: ContentHistory) => r && r.scopeId))
  async delete(@Body() payload: EnablePluginForm): Promise<void> {
    await this.service.deleteByPath(payload.enablePlugin)
  }
}

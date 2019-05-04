import { Controller, Get, Body, Post, Patch, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common'
import { ContentHistoriesService } from './content-histories.service'
import { CreateContentHistoryForm } from './dto/create-content-history.dto'
import { UpdateContentHistoryForm } from './dto/update-content-history.dto'
import { Pager } from '../base/pager'
import { ContentHistoriesSerializer } from './serializer/content-histories.serializer'
import { ContentHistorySerializer } from './serializer/content-history.serializer'
import { ApiUseTags, ApiOperation, ApiResponse, ApiImplicitQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import {
  API_RESPONSE_401,
  API_RESPONSE_200,
  API_RESPONSE_204,
  API_RESPONSE_201,
  API_QUERY_PAGE,
  API_QUERY_PER,
} from '../constant/swagger.constant'

@ApiResponse(API_RESPONSE_401)
@ApiUseTags('コンテンツ履歴')
@Controller('content-histories')
export class ContentHistoriesController extends BaseController {
  constructor(private readonly contentHistoriesService: ContentHistoriesService) {
    super()
  }

  @ApiOperation({
    title: 'コンテンツの新規作成',
    description: 'リリース予定毎に異なるデータとして作成します。',
  })
  @ApiResponse(API_RESPONSE_201)
  @Post()
  async create(@Body() payload: CreateContentHistoryForm): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.create(payload.contentHistory)
    return new ContentHistorySerializer().serialize({
      contentHistory: record,
    })
  }

  @ApiOperation({ title: 'コンテンツの更新' })
  @ApiResponse(API_RESPONSE_200)
  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateContentHistoryForm,
  ): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.update(id, payload.contentHistory)
    return new ContentHistorySerializer().serialize({
      contentHistory: record,
    })
  }

  @ApiOperation({ title: 'コンテンツの削除', description: 'リリース後は削除できません. ' })
  @ApiResponse(API_RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.contentHistoriesService.delete(id)
  }

  @ApiOperation({ title: 'コンテンツ一覧', description: '対象となるリリース予定のコンテンツ一覧. ' })
  @ApiResponse(API_RESPONSE_200)
  @ApiImplicitQuery({ name: 'releaseId', description: 'リリースID' })
  @ApiImplicitQuery(API_QUERY_PER)
  @ApiImplicitQuery(API_QUERY_PAGE)
  @Get()
  async findAll(
    @Query('releaseId') releaseId: number,
    @Query('page') page?: number,
    @Query('per') per?: number,
  ): Promise<ContentHistoriesSerializer> {
    const [contentHistories, pager] = await this.contentHistoriesService.searchWithPager(new Pager({ page, per }), {
      where: { releaseId: releaseId },
      order: { path: 'ASC', inactive: 'ASC', id: 'ASC' },
    })
    return new ContentHistoriesSerializer().serialize({ contentHistories, pager })
  }

  @ApiOperation({ title: 'コンテンツ' })
  @ApiResponse(API_RESPONSE_200)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.fetch(id)
    return new ContentHistorySerializer().serialize({ contentHistory: record })
  }
}

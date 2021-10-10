import { Controller, Get, Body, Post, Patch, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common'
import { ContentHistoriesService } from './content-histories.service'
import { CreateContentHistoryForm } from './dto/create-content-history.dto'
import { UpdateContentHistoryForm } from './dto/update-content-history.dto'
import { Pager } from '../base/pager'
import { ContentHistoriesSerializer } from './serializer/content-histories.serializer'
import { ContentHistorySerializer } from './serializer/content-history.serializer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_204, RESPONSE_201, QUERY_PAGE, QUERY_PER } from '../../constant/swagger.constant'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { ContentHistory } from '../../db/entity/content-history.entity'

@ApiTags('コンテンツ履歴')
@Controller('content-histories')
export class ContentHistoriesController extends BaseController {
  constructor(private readonly contentHistoriesService: ContentHistoriesService) {
    super()
  }

  @ApiOperation({
    summary: 'コンテンツの新規作成',
    description: 'リリース予定毎に異なるデータとして作成します。',
  })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.contentHistory.scopeId)
  async create(@Body() payload: CreateContentHistoryForm): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.create(payload.contentHistory)
    return new ContentHistorySerializer().serialize({
      contentHistory: record,
    })
  }

  @ApiOperation({ summary: 'コンテンツの更新' })
  @ApiResponse(RESPONSE_200)
  @Patch(':id')
  @ScopeGetter(({ body }) => body.contentHistory.scopeId)
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateContentHistoryForm
  ): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.update(id, payload.contentHistory)
    return new ContentHistorySerializer().serialize({
      contentHistory: record,
    })
  }

  @ApiOperation({
    summary: 'コンテンツの削除',
    description: 'リリース後は削除できません. ',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => ContentHistory.findOne(params.id).then((r: ContentHistory) => r && r.scopeId))
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.contentHistoriesService.delete(id)
  }

  @ApiOperation({
    summary: 'コンテンツ一覧',
    description: '対象となるリリース予定のコンテンツ一覧. ',
  })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'releaseId', description: 'リリースID' })
  @ApiQuery(QUERY_PER)
  @ApiQuery(QUERY_PAGE)
  @ScopeGetter(({ query }) =>
    ContentHistory.findOne({ where: { releaseId: query.releaseId } }).then((r) => r && r.scopeId)
  )
  @Get()
  async findAll(
    @Query('releaseId') releaseId: number,
    @Query('page') page?: number,
    @Query('per') per?: number
  ): Promise<ContentHistoriesSerializer> {
    const [contentHistories, pager] = await this.contentHistoriesService.searchWithPager(new Pager({ page, per }), {
      where: { releaseId: releaseId },
      order: { path: 'ASC', inactive: 'ASC', id: 'ASC' },
    })
    return new ContentHistoriesSerializer().serialize({
      contentHistories,
      pager,
    })
  }

  @ApiOperation({ summary: 'コンテンツ' })
  @ApiResponse(RESPONSE_200)
  @Get(':id')
  @ScopeGetter(({ params }) => ContentHistory.findOne(params.id).then((r: ContentHistory) => r && r.scopeId))
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ContentHistorySerializer> {
    const record = await this.contentHistoriesService.fetch(id)
    return new ContentHistorySerializer().serialize({ contentHistory: record })
  }
}

import { Controller, Get, Body, Post, Patch, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ReleasesService } from './releases.service'
import { CreateReleaseForm, PublishReleaseForm } from './dto/release.dto'
import { Pager } from '../base/pager'
import { ReleasesSerializer } from './serializer/releases.serializer'
import { ReleaseSerializer } from './serializer/release.serializer'
import { ApiUseTags, ApiOperation, ApiResponse, ApiImplicitQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import {
  API_RESPONSE_401,
  API_RESPONSE_200,
  API_RESPONSE_201,
  API_QUERY_PAGE,
  API_QUERY_PER,
} from '../constant/swagger.constant'

@ApiResponse(API_RESPONSE_401)
@ApiUseTags('リリース予定')
@Controller('releases')
export class ReleasesController extends BaseController {
  constructor(private readonly releasesService: ReleasesService) {
    super()
  }

  @ApiOperation({
    title: 'リリース予定の作成',
    description:
      '新たなリリースのためコンテンツ編集作業を開始します。前のリリースのコンテンツデータが新しいリリースのため複製されるため、それらを更新します',
  })
  @ApiResponse(API_RESPONSE_201)
  @Post()
  async create(@Body() payload: CreateReleaseForm): Promise<ReleaseSerializer> {
    const record = await this.releasesService.create(payload.release)
    return new ReleaseSerializer().serialize({
      release: { ...record },
    })
  }

  @ApiOperation({ title: 'リリースの実施', description: 'リリース日を設定し、コンテンツを一般公開する' })
  @ApiResponse(API_RESPONSE_200)
  @Patch(':id/publish')
  async publish(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: PublishReleaseForm,
  ): Promise<ReleaseSerializer> {
    const record = await this.releasesService.publish(id, payload.release)
    return new ReleaseSerializer().serialize({
      release: { ...record, scope: await record.scope },
    })
  }

  @ApiOperation({
    title: '限定リリースの実施',
    description: 'コンテンツを限定公開する. QueryStringにtokenの指定したユーザーのみ公開される',
  })
  @ApiResponse(API_RESPONSE_200)
  @Patch(':id/publishLimitation')
  async publishLimitation(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: PublishReleaseForm,
  ): Promise<ReleaseSerializer> {
    const record = await this.releasesService.publishLimitation(id)
    return new ReleaseSerializer().serialize({
      release: { ...record, scope: await record.scope },
    })
  }

  @ApiOperation({ title: 'リリース予定一覧' })
  @ApiResponse({ ...API_RESPONSE_200, type: ReleasesSerializer })
  @ApiImplicitQuery({ name: 'scopeId', required: false })
  @ApiImplicitQuery(API_QUERY_PER)
  @ApiImplicitQuery(API_QUERY_PAGE)
  @Get()
  async findAll(
    @Query('scopeId') scopeId?: number,
    @Query('page') page?: number,
    @Query('per') per?: number,
  ): Promise<ReleasesSerializer> {
    const [releases, pager] = await this.releasesService.searchWithPager(new Pager({ page, per }), {
      where: scopeId && { scopeId: scopeId },
      order: { releasedAt: 'DESC' },
    })
    return new ReleasesSerializer().serialize({ releases, pager })
  }

  @ApiOperation({ title: 'リリース予定' })
  @ApiResponse({ ...API_RESPONSE_200, type: ReleaseSerializer })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ReleaseSerializer> {
    const record = await this.releasesService.fetch(id)
    return new ReleaseSerializer().serialize({
      release: { ...record, scope: await record.scope },
    })
  }
}

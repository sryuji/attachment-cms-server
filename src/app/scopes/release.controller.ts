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
} from '@/src/constant/swagger.constant'

@ApiResponse(API_RESPONSE_401)
@ApiUseTags('releases')
@Controller('releases')
export class ReleasesController extends BaseController {
  constructor(private readonly releasesService: ReleasesService) {
    super()
  }

  @ApiOperation({ title: 'Releaseの作成' })
  @ApiResponse(API_RESPONSE_201)
  @Post()
  async create(@Body() payload: CreateReleaseForm): Promise<ReleaseSerializer> {
    const record = await this.releasesService.create(payload.release)
    return new ReleaseSerializer().serialize({
      release: { ...record },
    })
  }

  @ApiOperation({ title: 'リリース日の設定' })
  @ApiResponse(API_RESPONSE_200)
  @Patch(':id')
  async publish(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: PublishReleaseForm,
  ): Promise<ReleaseSerializer> {
    const record = await this.releasesService.publish(id, payload.release)
    return new ReleaseSerializer().serialize({
      release: { ...record, scope: await record.scope },
    })
  }

  @ApiOperation({ title: 'Release一覧' })
  @ApiResponse({ ...API_RESPONSE_200, type: ReleasesSerializer })
  @ApiImplicitQuery(API_QUERY_PER)
  @ApiImplicitQuery(API_QUERY_PAGE)
  @Get()
  async findAll(@Query('page') page?: number, @Query('per') per?: number): Promise<ReleasesSerializer> {
    const [releases, pager] = await this.releasesService.searchWithPager(new Pager({ page, per }), {
      order: { releasedAt: 'DESC' },
    })
    return new ReleasesSerializer().serialize({ releases, pager })
  }

  @ApiOperation({ title: 'Release詳細' })
  @ApiResponse({ ...API_RESPONSE_200, type: ReleaseSerializer })
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ReleaseSerializer> {
    const record = await this.releasesService.fetch(id)
    return new ReleaseSerializer().serialize({
      release: { ...record, scope: await record.scope },
    })
  }
}

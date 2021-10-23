import { Controller, Get, Body, Post, Patch, Param, ParseIntPipe, Query, Delete } from '@nestjs/common'
import { ReleasesService } from './releases.service'
import { CreateReleaseForm, PublishReleaseForm, UpdateReleaseForm } from './dto/release.dto'
import { Pager } from '../base/pager'
import { ReleasesSerializer } from './serializer/releases.serializer'
import { ReleaseSerializer } from './serializer/release.serializer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_201, QUERY_PAGE, QUERY_PER, RESPONSE_204 } from '../../constant/swagger.constant'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { Release } from '../../db/entity/release.entity'

@ApiTags('リリース予定')
@Controller('releases')
export class ReleasesController extends BaseController {
  constructor(private readonly releasesService: ReleasesService) {
    super()
  }

  @ApiOperation({
    summary: 'リリース予定の作成',
    description:
      '新たなリリースのためコンテンツ編集作業を開始します。前のリリースのコンテンツデータが新しいリリースのため複製されるため、それらを更新します',
  })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.release.scopeId)
  async create(@Body() payload: CreateReleaseForm): Promise<ReleaseSerializer> {
    const release = await this.releasesService.create(payload.release)
    return new ReleaseSerializer().serialize({ release })
  }

  @ApiOperation({
    summary: 'リリースの実施',
    description: 'リリース日を設定し、コンテンツを一般公開する',
  })
  @ApiResponse(RESPONSE_200)
  @Patch(':id/publish')
  @ScopeGetter(({ params }) => {
    return Release.findOne(params.id).then((r) => {
      return r && r.scopeId
    })
  })
  async publish(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: PublishReleaseForm
  ): Promise<ReleaseSerializer> {
    const release = await this.releasesService.publish(id, payload.release)
    return new ReleaseSerializer().serialize({ release })
  }

  @ApiOperation({
    summary: 'リリース予定の更新',
    description: 'リリース名を更新します',
  })
  @ApiResponse(RESPONSE_200)
  @Patch(':id')
  @ScopeGetter(({ params }) => Release.findOne(params.id).then((r) => r && r.scopeId))
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() payload: UpdateReleaseForm
  ): Promise<ReleaseSerializer> {
    const release = await this.releasesService.update(id, payload.release)
    return new ReleaseSerializer().serialize({ release })
  }

  @ApiOperation({
    summary: 'リリース予定の削除',
    description: 'リリースを削除します',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @ScopeGetter(({ params }) => Release.findOne(params.id).then((r) => r && r.scopeId))
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.releasesService.delete(id)
  }

  @ApiOperation({ summary: 'リリース予定一覧' })
  @ApiResponse({ ...RESPONSE_200, type: ReleasesSerializer })
  @ApiQuery({ name: 'scopeId', required: false })
  @ApiQuery(QUERY_PER)
  @ApiQuery(QUERY_PAGE)
  @Get()
  async findAll(
    @Query('scopeId') scopeId?: number,
    @Query('page') page?: number,
    @Query('per') per?: number
  ): Promise<ReleasesSerializer> {
    const [releases, pager] = await this.releasesService.searchWithPager(new Pager({ page, per }), {
      where: scopeId ? { scopeId: scopeId } : {},
      order: { releasedAt: 'DESC' },
    })
    return new ReleasesSerializer().serialize({ releases, pager })
  }

  @ApiOperation({ summary: 'リリース予定' })
  @ApiResponse({ ...RESPONSE_200, type: ReleaseSerializer })
  @Get(':id')
  @ScopeGetter(({ params }) => Release.findOne(params.id).then((r) => r && r.scopeId))
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ReleaseSerializer> {
    const release = await this.releasesService.fetch(id)
    return await new ReleaseSerializer().serialize({
      release,
    })
  }
}

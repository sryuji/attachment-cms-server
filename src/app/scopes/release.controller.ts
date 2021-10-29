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
import { ReleaseWithPagerSerializer } from './serializer/release-with-pager.serializer'

@ApiTags('リリース')
@Controller('releases')
export class ReleasesController extends BaseController {
  constructor(private readonly releasesService: ReleasesService) {
    super()
  }

  @ApiOperation({
    summary: 'リリースの作成',
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
    summary: 'リリースの更新',
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
    summary: 'リリースの削除',
    description: 'リリースを削除します。リリース済は削除できません。',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @ScopeGetter(({ params }) => Release.findOne(params.id).then((r) => r && r.scopeId))
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.releasesService.delete(id)
  }

  @ApiOperation({ summary: 'リリース一覧' })
  @ApiResponse({ ...RESPONSE_200, type: ReleasesSerializer })
  @ApiQuery({ name: 'scopeId', required: true })
  @ApiQuery(QUERY_PER)
  @ApiQuery(QUERY_PAGE)
  @Get()
  async findAll(
    @Query('scopeId') scopeId: number,
    @Query('page') page?: number,
    @Query('per') per?: number
  ): Promise<ReleasesSerializer> {
    const pager = new Pager({ page, per })
    const [releases, count] = await Release.createQueryBuilder()
      .where({ scopeId })
      .take(pager.per)
      .skip(pager.offset)
      .orderBy('releasedAt', 'DESC', 'NULLS FIRST')
      .getManyAndCount()
    pager.totalCount = count
    return new ReleasesSerializer().serialize({ releases, pager })
  }

  @ApiOperation({ summary: '最新のリリース' })
  @ApiResponse({ ...RESPONSE_200, type: ReleaseSerializer })
  @ApiQuery({ name: 'scopeId', required: true })
  @Get('latest')
  @ScopeGetter(({ query }) => query.scopeId as string)
  async findLatest(@Query('scopeId') scopeId: number): Promise<ReleaseSerializer> {
    const release = await Release.createQueryBuilder()
      .where({ scopeId })
      .orderBy('releasedAt', 'DESC', 'NULLS FIRST')
      .getOne()
    return await new ReleaseSerializer().serialize({
      release,
    })
  }

  @ApiOperation({ summary: '指定のリリース' })
  @ApiResponse({ ...RESPONSE_200, type: ReleaseWithPagerSerializer })
  @Get(':id')
  @ScopeGetter(({ params }) => Release.findOne(params.id).then((r) => r && r.scopeId))
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ReleaseWithPagerSerializer> {
    const release = await this.releasesService.fetch(id)
    const dataList = await Release.createQueryBuilder()
      .select('id')
      .where({ scopeId: release.scopeId })
      .orderBy('releasedAt', 'DESC', 'NULLS FIRST')
      .getRawMany()
    const ids = dataList.map((v) => v['id'])
    const offset = ids.findIndex((id) => id === release.id)
    const totalCount = ids.length
    const pager = new Pager({ page: offset + 1, per: 1, totalCount })
    return await new ReleaseWithPagerSerializer().serialize({
      release,
      pager,
    })
  }
}

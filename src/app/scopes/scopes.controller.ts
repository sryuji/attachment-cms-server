import { Controller, Get, Body, Post, Patch, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common'
import { ScopesService } from './scopes.service'
import { ScopeForm } from './dto/scope.dto'
import { Pager } from '../base/pager'
import { ScopesSerializer } from './serializer/scopes.serializer'
import { ScopeSerializer } from './serializer/scope.serializer'
import { Like } from 'typeorm'
import { ApiUseTags, ApiOperation, ApiResponse, ApiImplicitQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import {
  API_RESPONSE_401,
  API_RESPONSE_200,
  API_RESPONSE_204,
  API_RESPONSE_201,
  API_QUERY_PAGE,
  API_QUERY_PER,
} from '@/src/app/constant/swagger.constant'

@ApiResponse(API_RESPONSE_401)
@ApiUseTags('コンテンツ管理対象')
@Controller('scopes') // scopes.:format?で.jsonありもOKになる
export class ScopesController extends BaseController {
  constructor(private readonly scopesService: ScopesService) {
    super()
  }

  @ApiOperation({
    title: 'コンテンツ管理対象の登録',
    description:
      '管理対象ドメインを設定し、そのドメインのコンテンツ管理を開始します。 同じドメインのScopeを作成する事はでき、その場合はScope毎にリリースと権限は分離されます',
  })
  @ApiResponse(API_RESPONSE_201)
  @Post()
  async create(@Body() payload: ScopeForm): Promise<ScopeSerializer> {
    const record = await this.scopesService.create(payload.scope)
    return new ScopeSerializer().serialize({
      scope: record,
    })
  }

  @ApiOperation({ title: 'コンテンツ管理対象の更新' })
  @ApiResponse(API_RESPONSE_200)
  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: ScopeForm): Promise<ScopeSerializer> {
    const record = await this.scopesService.update(id, payload.scope)
    return new ScopeSerializer().serialize({
      scope: record,
    })
  }

  @ApiOperation({ title: 'コンテンツ管理対象の削除', description: 'Deprecated. 退会でもデータは削除しない' })
  @ApiResponse(API_RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.scopesService.delete(id)
  }

  @ApiOperation({ title: 'コンテンツ管理対象一覧' })
  @ApiResponse(API_RESPONSE_200)
  @ApiImplicitQuery({ name: 'domain', description: 'ドメイン. 部分一致', required: false, type: String })
  @ApiImplicitQuery(API_QUERY_PER)
  @ApiImplicitQuery(API_QUERY_PAGE)
  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('per') per?: number,
    @Query('domain') domain?: string,
  ): Promise<ScopesSerializer> {
    const pager = new Pager({ page, per })
    const [scopes, totalCount] = await this.scopesService
      .createQueryBuilder('scope')
      .leftJoinAndSelect('scope.defaultRelease', 'defaultRelease')
      .where(domain && [{ domain: Like(`%${domain}%`) }, { testDomain: Like(`%${domain}%`) }])
      .orderBy('defaultRelease.releasedAt', 'DESC')
      .skip(pager.offset)
      .take(pager.per)
      .getManyAndCount()
    pager.totalCount = totalCount
    return new ScopesSerializer().serialize({ scopes, pager })
  }

  @ApiOperation({ title: 'コンテンツ管理対象' })
  @ApiResponse(API_RESPONSE_200)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ScopeSerializer> {
    const record = await this.scopesService.fetch(id)
    return new ScopeSerializer().serialize({ scope: record })
  }
}

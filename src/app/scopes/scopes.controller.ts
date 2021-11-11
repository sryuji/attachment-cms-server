import { Controller, Get, Body, Post, Patch, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common'
import { ScopesService } from './scopes.service'
import { ScopeForm } from './dto/scope.dto'
import { ScopesSerializer } from './serializer/scopes.serializer'
import { ScopeSerializer } from './serializer/scope.serializer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_204, RESPONSE_201, QUERY_PAGE, QUERY_PER } from '../../constant/swagger.constant'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { AuthUser } from '../../decorator/auth-user.decorator'
import { ScopeRepository } from './repository/scope.repository'
import { Roles } from '../../decorator/roles.decorator'

@ApiTags('プロジェクト')
@Controller('scopes')
export class ScopesController extends BaseController {
  constructor(private readonly scopesService: ScopesService, private readonly scopeRepository: ScopeRepository) {
    super()
  }

  @ApiOperation({
    summary: 'プロジェクトの登録',
    description:
      '管理対象ドメインを設定し、そのドメインのコンテンツを管理します。 同じドメインのプロジェクトを作成する事はでき、その場合はプロジェクト毎にリリース範囲と権限は分離されます',
  })
  @ApiResponse(RESPONSE_201)
  @Post()
  async create(@Body() payload: ScopeForm, @AuthUser() user: AuthUserDto): Promise<ScopeSerializer> {
    const record = await this.scopesService.createWithAccountId(payload.scope, user.sub)
    return new ScopeSerializer().serialize({
      scope: record,
    })
  }

  @ApiOperation({ summary: 'プロジェクトの更新' })
  @ApiResponse(RESPONSE_200)
  @Patch(':id')
  @ScopeGetter(({ params }) => params.id)
  @Roles('owner')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: ScopeForm): Promise<ScopeSerializer> {
    const record = await this.scopesService.update(id, payload.scope)
    return new ScopeSerializer().serialize({
      scope: record,
    })
  }

  @ApiOperation({
    summary: 'プロジェクトの削除',
    description: 'Deprecated. 退会でもデータは削除しない',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => params.id)
  @Roles('owner')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.scopesService.delete(id)
  }

  @ApiOperation({ summary: 'プロジェクト一覧' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery(QUERY_PER)
  @ApiQuery(QUERY_PAGE)
  @Get()
  async findAll(
    @AuthUser() user: AuthUserDto,
    @Query('page') page?: number,
    @Query('per') per?: number
  ): Promise<ScopesSerializer> {
    const scopeIds = user.accountScopes.map((r) => r.scopeId)
    const [scopes, pager] = await this.scopeRepository.findAll(scopeIds, page, per)
    return new ScopesSerializer().serialize({ scopes, pager })
  }

  @ApiOperation({ summary: 'プロジェクト詳細' })
  @ApiResponse(RESPONSE_200)
  @Get(':id')
  @ScopeGetter(({ params }) => params.id)
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<ScopeSerializer> {
    const record = await this.scopesService.fetch(id)
    return new ScopeSerializer().serialize({ scope: record })
  }
}

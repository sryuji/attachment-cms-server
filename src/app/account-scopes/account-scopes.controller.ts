import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_200, RESPONSE_201, RESPONSE_204 } from '../../constant/swagger.constant'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { BaseController } from '../base/base.controller'
import { AccountScopesService } from './account-scopes.service'
import { AccountScopeForm } from './dto/account-scope.form'
import { AccountScopesSerializer } from './serializer/account-scopes.serializer'

@ApiTags('アカウント別プロジェクト')
@Controller('account-scopes')
export class AccountScopesController extends BaseController {
  constructor(private readonly accountScopesService: AccountScopesService) {
    super()
  }

  @ApiOperation({ summary: '対象アカウントから指定のプロジェクトへの権限を追加' })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.accountScope.accountId)
  async create(@Body() payload: AccountScopeForm): Promise<void> {
    await this.accountScopesService.create(payload.accountScope)
    return
  }

  @ApiOperation({ summary: '対象アカウントから指定のプロジェクトへの権限を削除' })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => params.id)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.accountScopesService.delete(id)
  }

  @ApiOperation({ summary: 'プロジェクト所属のアカウント一覧' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'scopeId', description: 'プロジェクトID' })
  @ScopeGetter(({ query }) => query.scopeId as string)
  @Get()
  async findAll(@Query('scopeId') scopeId: number): Promise<AccountScopesSerializer> {
    const accountScopes = await this.accountScopesService.search({
      where: { scopeId },
      relations: ['account'],
      order: { id: 'DESC' },
    })
    return new AccountScopesSerializer().serialize({ accountScopes })
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_200, RESPONSE_201, RESPONSE_204 } from '../../constant/swagger.constant'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { AuthUser } from '../../decorator/auth-user.decorator'
import { AccessTokenHeader } from '../../decorator/access-token-header.decorator'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { BaseController } from '../base/base.controller'
import { AccountScopesService } from './account-scopes.service'
import { AccountScopeForm } from './dto/account-scope.form'
import { AccountScopesSerializer } from './serializer/account-scopes.serializer'
import { UpdateAccountScopeForm } from './dto/update-account-scope.form'
import { Roles } from '../../decorator/roles.decorator'

@ApiTags('アカウント別プロジェクト')
@Controller('account-scopes')
export class AccountScopesController extends BaseController {
  constructor(private readonly accountScopesService: AccountScopesService) {
    super()
  }

  @ApiOperation({ summary: 'Deprecated. 対象アカウントから指定のプロジェクトへの権限を追加' })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.accountScope.accountId)
  async create(@Body() payload: AccountScopeForm): Promise<void> {
    // await this.accountScopesService.create(payload.accountScope)
    // return
  }

  @ApiOperation({
    summary:
      '対象アカウントから指定のプロジェクトへの権限を削除. そのアカウントに反映されるまで30分未満の時間がかかります。もしくは、再ログインしてください。',
  })
  @ApiResponse(RESPONSE_204)
  @Patch(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => params.id)
  @Roles('owner')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: UpdateAccountScopeForm): Promise<void> {
    await this.accountScopesService.update(id, payload.accountScope)
  }

  @ApiOperation({
    summary:
      '対象アカウントから指定のプロジェクトへの権限を削除. そのアカウントに反映されるまで30分未満の時間がかかります。もしくは、再ログインしてください。',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => params.id)
  @Roles('owner')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.accountScopesService.delete(id)
  }

  @ApiOperation({ summary: '指定のプロジェクトから自身を離脱させる' })
  @ApiResponse(RESPONSE_204)
  @Delete('')
  @ApiQuery({ name: 'scopeId', description: 'プロジェクトID', required: true })
  @HttpCode(204)
  @AccessTokenHeader('clear')
  async deleteByScopeId(
    @Query('scopeId', new ParseIntPipe()) scopeId: number,
    @AuthUser() user: AuthUserDto
  ): Promise<void> {
    const accountScope = await AccountScope.findOne({ where: { accountId: user.sub, scopeId } })
    if (!accountScope) throw new BadRequestException()
    await this.accountScopesService.delete(accountScope.id)
  }

  @ApiOperation({ summary: 'プロジェクト所属のアカウント一覧' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'scopeId', description: 'プロジェクトID', required: true })
  @ScopeGetter(({ query }) => query.scopeId as string)
  @Get()
  @Roles('owner')
  async findAll(@Query('scopeId') scopeId: number): Promise<AccountScopesSerializer> {
    const accountScopes = await this.accountScopesService.search({
      where: { scopeId },
      relations: ['account'],
      order: { id: 'DESC' },
    })
    return new AccountScopesSerializer().serialize({ accountScopes })
  }
}

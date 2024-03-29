import { Controller, Get, Body, Post, Param, Delete, HttpCode, ParseIntPipe, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_204, RESPONSE_201, QUERY_PAGE, QUERY_PER } from '../../constant/swagger.constant'
import { ScopeGetter } from '../../decorator/scope-getter.decorator'
import { ScopeInvitationForm } from './dto/scope-invitation.form'
import { ScopeInvitationsService } from './scope-invitations.service'
import { Pager } from '../base/pager'
import { ScopeInvitationSerializer } from './serializer/scope-invitation.serializer'
import { ScopeInvitationsSerializer } from './serializer/scope-invitations.serializer'
import { ScopeInvitation } from '../../db/entity/scope-invitation.entity'
import { AccountScopesService } from '../account-scopes/account-scopes.service'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { AuthUser } from '../../decorator/auth-user.decorator'
import { Roles } from '../../decorator/roles.decorator'

@ApiTags('プロジェクトへの招待を管理')
@Controller('scope-invitations')
export class ScopeInvitationsController extends BaseController {
  constructor(
    private readonly scopeInvitationsService: ScopeInvitationsService,
    private readonly accountScopesService: AccountScopesService
  ) {
    super()
  }

  @ApiOperation({
    summary: 'プロジェクトへ招待する',
  })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.scopeInvitation && body.scopeInvitation.scopeId)
  @Roles('owner')
  async create(@Body() payload: ScopeInvitationForm): Promise<ScopeInvitationSerializer> {
    const record = await this.scopeInvitationsService.create(payload.scopeInvitation)
    return new ScopeInvitationSerializer().serialize({ scopeInvitation: record })
  }

  @ApiOperation({
    summary: 'プロジェクトへの招待の削除',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => ScopeInvitation.findOne(params.id).then((r) => r && r.scopeId))
  @Roles('owner')
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.scopeInvitationsService.delete(id)
  }

  @ApiOperation({ summary: 'プロジェクトへの招待一覧' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery(QUERY_PER)
  @ApiQuery(QUERY_PAGE)
  @Get()
  @Roles('owner')
  @ScopeGetter(({ query }) => query.scopeId as string)
  async findAll(
    @Query('scopeId') scopeId: number,
    @Query('page') page?: number,
    @Query('per') per?: number
  ): Promise<ScopeInvitationsSerializer> {
    const [scopeInvitations, pager] = await this.scopeInvitationsService.searchWithPager(new Pager({ page, per }), {
      where: { scopeId },
      order: { createdAt: 'ASC' },
    })
    return new ScopeInvitationsSerializer().serialize({ scopeInvitations, pager })
  }

  @ApiOperation({ summary: 'プロジェクトへの招待を受ける' })
  @ApiResponse(RESPONSE_200)
  @Post(':token/join')
  @ScopeGetter(({ params }) => ScopeInvitation.findOne(params.id).then((r) => r && r.scopeId))
  async join(@Param('token') token: string, @AuthUser() user: AuthUserDto): Promise<ScopeInvitationSerializer> {
    const record = await this.scopeInvitationsService.join(token, user)
    return new ScopeInvitationSerializer().serialize({ scopeInvitation: record })
  }

  @ApiOperation({ summary: 'プロジェクトへの招待の詳細' })
  @ApiResponse(RESPONSE_200)
  @Get(':token')
  async findOne(@Param('token') token: string, @AuthUser() user: AuthUserDto): Promise<ScopeInvitationSerializer> {
    const record = await ScopeInvitation.findOne({ where: { invitationToken: token } })
    await this.accountScopesService.authorizeScope(user, record.scopeId)
    return new ScopeInvitationSerializer().serialize({ scopeInvitation: record })
  }
}

import { Body, Controller, Delete, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_201, RESPONSE_204 } from 'src/constant/swagger.constant'
import { ScopeGetter } from 'src/decorator/scope-getter.decorator'
import { BaseController } from '../base/base.controller'
import { AccountScopesService } from './account-scopes.service'
import { AccountScopeForm } from './dto/account-scope.form'

@ApiTags('アカウント別管理対象')
@Controller('account-scopes')
export class AccountScopesController extends BaseController {
  constructor(private readonly accountScopesService: AccountScopesService) {
    super()
  }

  @ApiOperation({ summary: '対象アカウントから指定の管理対象への権限を追加' })
  @ApiResponse(RESPONSE_201)
  @Post()
  @ScopeGetter(({ body }) => body.accountScope.accountId)
  async create(@Body() payload: AccountScopeForm): Promise<void> {
    await this.accountScopesService.create(payload.accountScope)
    return
  }

  @ApiOperation({ summary: '対象アカウントから指定の管理対象への権限を削除' })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  @ScopeGetter(({ params }) => params.id)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.accountScopesService.delete(id)
  }
}

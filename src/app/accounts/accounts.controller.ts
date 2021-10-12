import { Controller, Get, Body, Patch, Delete, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_204 } from '../../constant/swagger.constant'
import { AccountsService } from './accounts.service'
import { AccountSerializer } from './serializer/account.serializer'
import { AccountForm } from './dto/account.form'
import { AuthUserDto } from '../auth/dto/auth-user.dto'
import { AuthUser } from '../../decorator/auth-user.decorator'

@ApiTags('アカウント')
@Controller('accounts')
export class AccountsController extends BaseController {
  constructor(private readonly accountsService: AccountsService) {
    super()
  }

  @ApiOperation({ summary: 'アカウントの更新' })
  @ApiResponse(RESPONSE_200)
  @Patch()
  async update(@AuthUser() user: AuthUserDto, @Body() payload: AccountForm): Promise<AccountSerializer> {
    const record = await this.accountsService.update(user.sub, payload.account)
    return new AccountSerializer().serialize({
      account: record,
    })
  }

  @ApiOperation({
    summary: 'アカウントの削除',
    description: '退会してもコンテンツは削除しない',
  })
  @ApiResponse(RESPONSE_204)
  @Delete()
  @HttpCode(204)
  async delete(@AuthUser() user: AuthUserDto): Promise<void> {
    await this.accountsService.delete(user.sub)
  }

  @ApiOperation({ summary: 'アカウント情報の取得' })
  @ApiResponse(RESPONSE_200)
  @Get()
  async findOne(@AuthUser() user: AuthUserDto): Promise<AccountSerializer> {
    const record = await this.accountsService.fetch(user.sub)
    return new AccountSerializer().serialize({ account: record })
  }
}

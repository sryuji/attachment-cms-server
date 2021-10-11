import { Controller, Get, Body, Patch, Param, Delete, HttpCode, ParseIntPipe, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_200, RESPONSE_204 } from '../../constant/swagger.constant'
import { AccountsService } from './accounts.service'
import { AccountSerializer } from './serializer/account.serializer'
import { AccountForm } from './dto/account.form'
import { AccountGuard } from 'src/guard/account.guard'

@ApiTags('アカウント')
@Controller('accounts')
@UseGuards(AccountGuard)
export class AccountsController extends BaseController {
  constructor(private readonly accountsService: AccountsService) {
    super()
  }

  @ApiOperation({ summary: 'アカウントの更新' })
  @ApiResponse(RESPONSE_200)
  @Patch(':id')
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() payload: AccountForm): Promise<AccountSerializer> {
    const record = await this.accountsService.update(id, payload.account)
    return new AccountSerializer().serialize({
      account: record,
    })
  }

  @ApiOperation({
    summary: 'アカウントの削除',
    description: '退会してもコンテンツは削除しない',
  })
  @ApiResponse(RESPONSE_204)
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseIntPipe()) id: number): Promise<void> {
    await this.accountsService.delete(id)
  }

  @ApiOperation({ summary: 'アカウント情報の取得' })
  @ApiResponse(RESPONSE_200)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<AccountSerializer> {
    const record = await this.accountsService.fetch(id)
    return new AccountSerializer().serialize({ account: record })
  }
}

import { Controller, Get, Header, Query } from '@nestjs/common'
import { ContentsService } from './contents.service'
import { ContentsSerializer } from './serializer/contents.serializer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { BaseController } from '../base/base.controller'
import { RESPONSE_401, RESPONSE_200 } from '../constant/swagger.constant'

@ApiResponse(RESPONSE_401)
@ApiTags('リリース対象コンテンツ')
@Controller('contents')
export class ContentsController extends BaseController {
  constructor(private readonly contentsService: ContentsService) {
    super()
  }

  @ApiOperation({ summary: '限定リリースのコンテンツ' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'token', required: true, description: '限定リリース用のトークン' })
  @Header('Cache-Control', 'none')
  @Get('limited')
  async findLimitedReleaseContents(@Query('token') limitedReleaseToken: string): Promise<ContentsSerializer> {
    const contents = await this.contentsService.searchLimitedReleaseTarget(limitedReleaseToken)
    return new ContentsSerializer().serialize({ contents })
  }

  @ApiOperation({ summary: 'リリース対象のコンテンツ' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'token', required: true, description: 'コンテンツ管理対象のトークン' })
  @Header('Cache-Control', '900')
  @Get()
  async findReleaseContents(@Query('token') token: string): Promise<ContentsSerializer> {
    const contents = await this.contentsService.searchReleaseTarget(token)
    return new ContentsSerializer().serialize({ contents })
  }
}

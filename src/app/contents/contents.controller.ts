import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Header,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'
import { ContentsService } from './contents.service'
import { ContentsSerializer } from './serializer/contents.serializer'
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'
import { RESPONSE_401, RESPONSE_200, RESPONSE_403 } from '../../constant/swagger.constant'

@ApiTags('リリース対象コンテンツ')
@Controller('contents')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@ApiResponse(RESPONSE_401)
@ApiResponse(RESPONSE_403)
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @ApiOperation({ summary: '限定リリースのコンテンツ' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'token', required: true, description: '限定リリース用のトークン' })
  @Header('Cache-Control', 'no-store')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  @Get('limited')
  async findLimitedReleaseContents(@Query('token') limitedReleaseToken: string): Promise<ContentsSerializer> {
    const contents = await this.contentsService.searchLimitedReleaseTarget(limitedReleaseToken)
    return new ContentsSerializer().serialize(contents)
  }

  @ApiOperation({ summary: 'リリース対象のコンテンツ' })
  @ApiResponse(RESPONSE_200)
  @ApiQuery({ name: 'token', required: true, description: 'コンテンツ管理対象のトークン' })
  @Header('Cache-Control', 'max-age=1800')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  @Get()
  async findReleaseContents(@Query('token') token: string): Promise<ContentsSerializer> {
    const contents = await this.contentsService.searchReleaseTarget(token)
    return new ContentsSerializer().serialize(contents)
  }
}

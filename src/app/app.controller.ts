import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RESPONSE_200 } from '../constant/swagger.constant'

@ApiTags('root')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'Health Check without db access.' })
  @ApiResponse(RESPONSE_200)
  @Get('/health')
  async health() {
    return { status: 'OK' }
  }
}

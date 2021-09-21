import { UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { RESPONSE_422, RESPONSE_400, RESPONSE_403 } from '../constant/swagger.constant'

// @Controller('xxx.:format?') // 左記で.jsonありもOKになる
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@ApiResponse(RESPONSE_422)
@ApiResponse(RESPONSE_400)
@ApiResponse(RESPONSE_403)
export abstract class BaseController {}

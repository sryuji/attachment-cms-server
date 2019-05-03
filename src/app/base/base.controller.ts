import { UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { API_RESPONSE_422, API_RESPONSE_400, API_RESPONSE_403 } from '@/src/app/constant/swagger.constant'

// @Controller('xxx.:format?') // 左記で.jsonありもOKになる
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@ApiResponse(API_RESPONSE_422)
@ApiResponse(API_RESPONSE_400)
@ApiResponse(API_RESPONSE_403)
export abstract class BaseController {}

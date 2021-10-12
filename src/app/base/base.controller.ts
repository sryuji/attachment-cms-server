import { UseInterceptors, ClassSerializerInterceptor, SerializeOptions, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { RESPONSE_422, RESPONSE_400, RESPONSE_403, RESPONSE_401 } from '../../constant/swagger.constant'
import { AccountScopeGuard } from '../../guard/account-scope.guard'
import { JwtAuthGuard } from '../../guard/jwt-auth.guard'

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@ApiResponse(RESPONSE_400)
@ApiResponse(RESPONSE_401)
@ApiResponse(RESPONSE_403)
@ApiResponse(RESPONSE_422)
@UseGuards(JwtAuthGuard, AccountScopeGuard)
@ApiBearerAuth()
export abstract class BaseController {}

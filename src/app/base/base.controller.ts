import { UseInterceptors, ClassSerializerInterceptor, SerializeOptions, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { RESPONSE_422, RESPONSE_400, RESPONSE_403, RESPONSE_401 } from '../../constant/swagger.constant'
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard'
import { AccountScopeGuard } from 'src/guard/account-scope.guard'

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludePrefixes: ['_'] })
@ApiResponse(RESPONSE_400)
@ApiResponse(RESPONSE_401)
@ApiResponse(RESPONSE_403)
@ApiResponse(RESPONSE_422)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseGuards(AccountScopeGuard)
export abstract class BaseController {}

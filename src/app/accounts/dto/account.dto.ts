import { Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class AccountDto extends BaseDto {
  @ApiPropertyOptional({ description: '姓' })
  @Allow()
  lastName: string

  @ApiPropertyOptional({ description: '名' })
  @Allow()
  firstName: string
}

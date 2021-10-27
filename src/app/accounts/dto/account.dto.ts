import { Allow } from 'class-validator'
import { UpdatableDto } from '../../base/updatable.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class AccountDto extends UpdatableDto {
  @ApiPropertyOptional({ description: '姓' })
  @Allow()
  lastName: string

  @ApiPropertyOptional({ description: '名' })
  @Allow()
  firstName: string
}

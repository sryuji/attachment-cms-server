import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { AccountDto } from './account.dto'

export class AccountForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AccountDto)
  account: AccountDto
}

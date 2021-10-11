import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { AccountScopeDto } from './account-scope.dto'

export class AccountScopeForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => AccountScopeDto)
  accountScope: AccountScopeDto
}

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { UpdateAccountScopeDto } from './update-account-scope.dto'

export class UpdateAccountScopeForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateAccountScopeDto)
  accountScope: UpdateAccountScopeDto
}

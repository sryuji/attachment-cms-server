import { ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ScopeInvitationDto } from './scope-invitation.dto'

export class ScopeInvitationForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ScopeInvitationDto)
  scopeInvitation: ScopeInvitationDto
}

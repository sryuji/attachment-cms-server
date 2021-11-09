import { IsEmail, IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ScopeInvitationDto {
  @ApiProperty({
    description: '招待相手のEmailアドレス',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: '招待するScope ID',
  })
  @IsNotEmpty()
  @IsInt()
  scopeId: number
}

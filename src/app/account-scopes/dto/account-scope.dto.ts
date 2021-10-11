import { IsEmail, IsInt, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AccountScopeDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  readonly email: string

  accountId: number

  @IsInt({ message: 'アカウントIDは、整数です。' })
  @IsNotEmpty()
  @ApiProperty({ required: true })
  readonly scopeId: number
}

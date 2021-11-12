import { IsIn, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from '../../../enum/role.enum'

export class UpdateAccountScopeDto {
  @ApiProperty({ required: true })
  @IsInt({ message: 'IDは、整数です。' })
  id: number

  @ApiProperty({
    enum: Object.values(Role),
    description: 'Project別の権限',
    default: 'member',
  })
  @IsIn(Object.values(Role))
  role: string
}

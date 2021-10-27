import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * valdiation: https://github.com/typestack/class-validator
 */
export class UpdatableDto {
  @IsInt({ message: 'IDは、整数です。' })
  @ApiProperty({
    required: true,
    example: null,
    description: '更新時は必須. 新規データ作成時は指定不要',
  })
  id: number
}

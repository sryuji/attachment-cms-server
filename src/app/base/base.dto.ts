import { IsInt, IsOptional } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'

/**
 * valdiation: https://github.com/typestack/class-validator
 */
export class BaseDto {
  @IsInt({ message: 'IDは、整数です。' })
  @IsOptional()
  @ApiModelProperty({ required: false, example: null, description: '更新時は必須. 新規データ作成時は指定不要' })
  readonly id?: number
}
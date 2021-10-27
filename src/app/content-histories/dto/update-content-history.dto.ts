import { IsNotEmpty, ValidateNested, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ContentHistoryDto } from './content-history.dto'

export class UpdateContentHistoryDto extends ContentHistoryDto {
  @IsInt({ message: 'IDは、整数です。' })
  @ApiProperty({
    required: true,
    example: null,
  })
  id?: number

  @ApiProperty({
    description: '利用停止フラグ',
    example: false,
    default: false,
  })
  @IsNotEmpty()
  inactive: boolean
}

/**
 * Swagger連携時はForm定義がないと、request bodyのswagger側の自動表示が巧くいかないため利用している
 */
export class UpdateContentHistoryForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateContentHistoryDto)
  contentHistory: UpdateContentHistoryDto
}

import { IsNotEmpty, ValidateNested, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ContentHistoryDto } from './content-history.dto'

export class CreateContentHistoryDto extends ContentHistoryDto {
  @ApiProperty({ description: 'Release ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  releaseId: number

  @ApiProperty({ description: 'Scope ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  scopeId: number
}

/**
 * Swagger連携時はForm定義がないと、request bodyのswagger側の自動表示が巧くいかないため利用している
 */
export class CreateContentHistoryForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateContentHistoryDto)
  contentHistory: CreateContentHistoryDto
}

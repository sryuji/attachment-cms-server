import { IsNotEmpty, ValidateNested, IsInt, Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateContentHistoryDto extends BaseDto {
  @ApiProperty({ description: 'Release ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly releaseId: number

  @ApiProperty({ description: 'Scope ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly scopeId: number

  @ApiProperty({
    description: 'コンテンツの存在するパス',
    example: '/api-docs',
  })
  @IsNotEmpty()
  readonly path: string

  @ApiPropertyOptional({
    description: 'コンテンツのselector',
    example: '#operations-tag-コンテンツ管理対象 > a',
  })
  @Allow()
  readonly selector: string

  @ApiPropertyOptional({
    description: '置換/挿入するコンテンツ',
    example: '<span>コンテンツ</span>',
  })
  @Allow()
  readonly content: string

  @ApiPropertyOptional({
    description: 'selectorに対する操作',
    example: 'append',
  })
  @Allow()
  readonly action: string
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

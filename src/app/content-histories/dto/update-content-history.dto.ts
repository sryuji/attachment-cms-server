import { IsNotEmpty, ValidateNested, Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class UpdateContentHistoryDto extends BaseDto {
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

  @ApiProperty({
    description: '利用停止フラグ',
    example: false,
    default: false,
  })
  @IsNotEmpty()
  readonly inactive: boolean
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

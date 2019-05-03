import { IsNotEmpty, ValidateNested, IsInt, Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class CreateContentHistoryDto extends BaseDto {
  @ApiModelProperty({ description: 'Release ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly releaseId: number

  @ApiModelProperty({ description: 'コンテンツの存在するパス', example: '/api-docs' })
  @IsNotEmpty()
  readonly path: string

  @ApiModelPropertyOptional({
    description: 'コンテンツのselector',
    example: '#operations-tag-コンテンツ管理対象 > a',
  })
  @Allow()
  readonly selector: string

  @ApiModelPropertyOptional({
    description: '置換/挿入するコンテンツ',
    example: '<span>コンテンツ</span>',
  })
  @Allow()
  readonly content: string

  @ApiModelPropertyOptional({ description: 'selectorに対する操作', example: 'append' })
  @Allow()
  readonly action: string
}

/**
 * Swagger連携時はForm定義がないと、request bodyのswagger側の自動表示が巧くいかないため利用している
 */
export class CreateContentHistoryForm {
  @ApiModelProperty()
  @ValidateNested()
  @Type(() => CreateContentHistoryDto)
  contentHistory: CreateContentHistoryDto
}

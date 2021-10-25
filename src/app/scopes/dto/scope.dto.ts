import { IsNotEmpty, ValidateNested, Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ScopeDto extends BaseDto {
  @ApiProperty({ description: '識別名', example: 'attachment CMS' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '対象ドメイン', example: 'https://example.com' })
  @IsNotEmpty()
  domain: string

  @ApiPropertyOptional({ description: '用途など説明を自由記入', example: '' })
  @Allow()
  description: string
}

/**
 * Swagger連携時はForm定義がないと、request bodyのswagger側の自動表示が巧くいかないため利用している
 */
export class ScopeForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ScopeDto)
  scope: ScopeDto
}

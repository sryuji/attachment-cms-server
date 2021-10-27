import { IsNotEmpty, ValidateNested, Allow, IsInt, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ScopeDto {
  @IsInt({ message: 'IDは、整数です。' })
  @ApiProperty({
    example: null,
    description: '更新時は必須. 新規データ作成時は指定不要',
  })
  @IsOptional()
  id: number

  @ApiProperty({ description: '識別名', example: 'attachment CMS' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '対象ドメイン', example: 'https://example.com' })
  @Allow()
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

import { IsNotEmpty, ValidateNested, Allow } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ScopeDto extends BaseDto {
  @ApiProperty({ description: '識別名', example: 'attachment CMS' })
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({ description: '対象ドメイン', example: 'https://example.com' })
  @IsNotEmpty()
  readonly domain: string

  @ApiPropertyOptional({
    description: 'テスト環境のドメイン',
    example: 'https://test.example.com',
  })
  @Allow()
  readonly testDomain: string

  @ApiPropertyOptional({ description: '用途など説明を自由記入', example: '' })
  @Allow()
  readonly description: string
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

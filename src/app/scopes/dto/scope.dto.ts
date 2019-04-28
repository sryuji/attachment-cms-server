import { IsNotEmpty, ValidateNested } from 'class-validator'
import { BaseDto } from '../../base/base.dto'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ScopeDto extends BaseDto {
  @ApiModelProperty({ description: '識別名', example: 'attachment CMS' })
  @IsNotEmpty()
  readonly name: string

  @ApiModelProperty({ description: '対象ドメイン', example: 'https://example.com' })
  @IsNotEmpty()
  readonly domain: string

  @ApiModelPropertyOptional({ description: 'テスト環境のドメイン', example: 'https://test.example.com' })
  readonly testDomain: string

  @ApiModelPropertyOptional({ description: '用途など説明を自由記入', example: '' })
  readonly description: string
}

/**
 * Swagger連携時はForm定義がないと、request bodyのswagger側の自動表示が巧くいかないため利用している
 */
export class ScopeForm {
  @ApiModelProperty()
  @ValidateNested()
  @Type(() => ScopeDto)
  scope: ScopeDto
}

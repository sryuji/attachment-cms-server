import { BaseDto } from '../../base/base.dto'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsDate, IsInt, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class ReleaseDto extends BaseDto {
  @ApiModelProperty({ description: 'scope ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly scopeId: number
}

export class PublishReleaseDto extends BaseDto {
  @ApiModelPropertyOptional({ default: null, description: 'リリース日', example: new Date() })
  @IsDate()
  @Type(() => Date)
  readonly releasedAt: Date
}

/**
 * Swagger連携時、Form定義がなしで、@Body('property')形式を使うとrequest bodyのDocument表示が巧くいかない
 * そのため、@Body()でbody全体を表現したFormをinject対象にしている
 */
export class CreateReleaseForm {
  @ApiModelProperty()
  @ValidateNested()
  @Type(() => ReleaseDto)
  release: ReleaseDto
}

export class PublishReleaseForm {
  @ApiModelProperty()
  @ValidateNested()
  @Type(() => PublishReleaseDto)
  release: PublishReleaseDto
}

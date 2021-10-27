import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsDate, IsInt, ValidateNested, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { UpdatableDto } from '../../base/updatable.dto'

export class UpdateReleaseDto extends UpdatableDto {
  @ApiPropertyOptional({
    description: 'リリース名を自由記入',
    example: null,
  })
  @IsOptional()
  name: string
}

export class CreateReleaseDto {
  @ApiPropertyOptional({
    description: 'リリース名を自由記入',
    example: null,
  })
  @IsOptional()
  name: string

  @ApiProperty({ description: 'scope ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  scopeId: number

  @ApiPropertyOptional({
    description: '編集対象にしたいリリースID. 未指定だと最新のものが自動的に選ばれる',
    example: null,
  })
  @IsOptional()
  @IsInt()
  sourceReleaseId: number
}

export class PublishReleaseDto extends UpdatableDto {
  @ApiProperty({
    default: null,
    description: 'リリース日',
    example: new Date(),
  })
  @IsDate()
  @Type(() => Date)
  releasedAt: Date
}

/**
 * Swagger連携時、Form定義がなしで、@Body('property')形式を使うとrequest bodyのDocument表示が巧くいかない
 * そのため、@Body()でbody全体を表現したFormをinject対象にしている
 */
export class CreateReleaseForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateReleaseDto)
  release: CreateReleaseDto
}

export class UpdateReleaseForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UpdateReleaseDto)
  release: UpdateReleaseDto
}

export class PublishReleaseForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PublishReleaseDto)
  release: PublishReleaseDto
}

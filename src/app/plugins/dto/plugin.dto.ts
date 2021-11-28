import { Allow, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { PluginFileDto } from './plugin-file.dto'

export class PluginDto {
  @ApiPropertyOptional({ description: 'Plugin ID' })
  @IsNumber()
  @IsOptional()
  id?: number

  @ApiProperty({ description: 'プラグイン名' })
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description:
      '対象Pathページにロードするためのタグ. 自動生成されるので通常は未指定. 個別指定が必要な時だけ指定すること。',
  })
  @Allow()
  content?: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => PluginFileDto)
  pluginFiles: PluginFileDto[]
}

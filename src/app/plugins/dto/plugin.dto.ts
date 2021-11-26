import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator'
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

  @ApiPropertyOptional({ description: '対象Pathページにロードするためのタグ' })
  content?: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => PluginFileDto)
  pluginFiles: PluginFileDto[]
}

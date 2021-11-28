import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { PluginFileKind } from '../../../enum/plugin-file-kind.enum'

export class PluginFileDto {
  @ApiPropertyOptional({ description: 'PluginFile ID' })
  @IsInt()
  @IsOptional()
  id?: number

  @ApiProperty({ description: '種別', enum: Object.values(PluginFileKind) })
  @IsIn(Object.values(PluginFileKind))
  kind: string

  @ApiProperty({ description: 'PluginのURL' })
  @IsNotEmpty()
  url: string
}

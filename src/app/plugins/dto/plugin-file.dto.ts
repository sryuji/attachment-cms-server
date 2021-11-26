import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PluginFileDto {
  @ApiPropertyOptional({ description: 'PluginFile ID' })
  id?: number

  @ApiProperty({ description: '種別' })
  kind: string

  @ApiProperty({ description: 'PluginのURL' })
  url: string
}

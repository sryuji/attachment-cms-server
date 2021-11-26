import { Allow, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EnablePluginDto {
  @IsInt({ message: '整数で入力する必要があります' })
  @ApiProperty({ description: 'Plugin ID' })
  pluginId: number

  @ApiProperty({ description: '対象ページのPath' })
  @Allow()
  path: string

  @ApiProperty({ description: 'Scope ID' })
  @IsInt({ message: '整数で入力する必要があります' })
  scopeId: number
}

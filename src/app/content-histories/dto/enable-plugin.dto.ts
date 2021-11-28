import { Allow, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EnablePluginDto {
  @IsInt({ message: 'pluginIdは、整数で入力する必要があります' })
  @ApiProperty({ description: 'Plugin ID' })
  pluginId: number

  @ApiProperty({ description: '対象ページのPath' })
  @Allow()
  path: string

  @ApiProperty({ description: 'Scope ID' })
  @IsInt({ message: 'scopeIdは、整数で入力する必要があります' })
  scopeId: number

  @ApiProperty({ description: 'Release ID' })
  @IsInt({ message: 'releaseIdは、整数で入力する必要があります' })
  releaseId: number
}

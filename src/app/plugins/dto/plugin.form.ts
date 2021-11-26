import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { PluginDto } from './plugin.dto'

export class PluginForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => PluginDto)
  plugin: PluginDto
}

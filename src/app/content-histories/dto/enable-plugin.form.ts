import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { EnablePluginDto } from './enable-plugin.dto'

export class EnablePluginForm {
  @ApiProperty()
  @ValidateNested()
  @Type(() => EnablePluginDto)
  enablePlugin: EnablePluginDto
}

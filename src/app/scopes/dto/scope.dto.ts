import { IsNotEmpty } from 'class-validator'
import { BaseDto } from '../../base/base.dto'

export class ScopeDto extends BaseDto {
  @IsNotEmpty()
  readonly name: string
  @IsNotEmpty()
  readonly domain: string
  readonly testDomain: string
  readonly description: string
}

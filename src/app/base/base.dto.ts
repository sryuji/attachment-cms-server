import { IsInt, IsOptional } from 'class-validator'

/**
 * valdiation: https://github.com/typestack/class-validator
 */
export class BaseDto {
  @IsInt()
  @IsOptional()
  readonly id?: number
}

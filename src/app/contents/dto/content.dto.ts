import { ApiProperty } from '@nestjs/swagger'

export class ContentDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  type: string

  @ApiProperty()
  selector: string

  @ApiProperty()
  content: string

  @ApiProperty()
  action: string
}

import { ApiProperty } from '@nestjs/swagger'

export class ContentDto {
  @ApiProperty()
  id: number

  @ApiProperty()
  selector: string

  @ApiProperty()
  content: string

  @ApiProperty()
  action: string
}

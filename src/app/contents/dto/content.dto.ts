import { ApiProperty } from '@nestjs/swagger'

export class ContentDto {
  @ApiProperty()
  selector: string

  @ApiProperty()
  content: string

  @ApiProperty()
  action: string
}

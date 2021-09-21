import { Expose } from 'class-transformer'
import { ApiResponseProperty } from '@nestjs/swagger'

export class Pager {
  @ApiResponseProperty()
  page: number
  @ApiResponseProperty()
  per: number
  @ApiResponseProperty()
  totalCount: number

  constructor(attributes: Partial<Pager>) {
    this.page = attributes.page || 1
    this.per = attributes.per || 20
  }

  @ApiResponseProperty()
  @Expose()
  get totalPages(): number {
    if (!this.totalCount || !this.per) return null
    return Math.ceil(this.totalCount / this.per)
  }

  get offset(): number {
    return (this.page - 1) * this.per
  }

  public toFindManyOptions(): Record<'take' | 'skip', number> {
    return {
      take: this.per,
      skip: this.offset,
    }
  }
}

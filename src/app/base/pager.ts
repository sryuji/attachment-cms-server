import { Expose } from 'class-transformer'
import { ApiResponseModelProperty } from '@nestjs/swagger'

export class Pager {
  @ApiResponseModelProperty()
  page: number
  @ApiResponseModelProperty()
  per: number
  @ApiResponseModelProperty()
  totalCount: number

  constructor(attributes: Partial<Pager>) {
    this.page = attributes.page || 1
    this.per = attributes.per || 20
  }

  @ApiResponseModelProperty()
  @Expose()
  get totalPages(): number {
    if (!this.totalCount || !this.per) return null
    return Math.ceil(this.totalCount / this.per)
  }

  get offset(): number {
    return (this.page - 1) * this.per
  }

  public toFindManyOptions(): object {
    return {
      take: this.per,
      skip: this.offset,
    }
  }
}

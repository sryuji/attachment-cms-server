import { Expose } from 'class-transformer'

export class Pager {
  page: number
  per: number
  totalCount: number

  constructor(query: any) {
    this.page = query.page || 1
    this.per = query.per || 20
  }

  @Expose()
  get totalPages(): number {
    if (!this.totalCount || !this.per) return null
    return Math.ceil(this.totalCount / this.per)
  }

  public getOffset(): number {
    return (this.page - 1) * this.per
  }

  public toFindManyOptions(): object {
    return {
      take: this.per,
      skip: this.getOffset(),
    }
  }
}

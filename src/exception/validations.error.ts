import { ValidationError } from 'class-validator'

export class ValidationsError extends Error {
  public readonly sourceList: ValidationError[] | string[]

  constructor(sourceList?: ValidationError[] | string[]) {
    super()
    this.sourceList = sourceList
  }

  public getMessages(): string[] {
    if (!this.sourceList || this.sourceList.length === 0) return null

    const source = this.sourceList[0]
    if (typeof source === 'string') return this.sourceList as string[]
    return this.getConstraintsMessages(this.sourceList as ValidationError[])
  }

  private getConstraintsMessages(list: ValidationError[]) {
    return list.reduce((result, err) => {
      if (err.children && err.children.length > 0) {
        result.splice(result.length, 0, ...this.getConstraintsMessages(err.children))
      }
      if (err.constraints) {
        const constraintValues = Object.values(err.constraints)
        constraintValues.length > 0 && result.splice(result.length, 0, ...constraintValues)
      }
      return result
    }, [])
  }
}

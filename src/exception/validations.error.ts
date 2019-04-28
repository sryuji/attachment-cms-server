import { ValidationError } from 'class-validator'

export class ValidationsError extends Error {
  public readonly sourceList: ValidationError[]

  constructor(sourceList?: ValidationError[]) {
    super()
    this.sourceList = sourceList
  }

  public getMessages(): string[] {
    return this.sourceList.reduce((result, err) => {
      return result.concat(Object.values(err.constraints))
    }, [])
  }
}

export abstract class BaseSerializer {
  public serialize(attributes?: any): this {
    return Object.assign(this, attributes)
  }
}

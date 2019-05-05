export abstract class BaseSerializer {
  public serialize(attributes: any): this | Promise<this> {
    return Object.assign(this, attributes)
  }
}

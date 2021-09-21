export abstract class BaseSerializer {
  public serialize(attributes: unknown): this | Promise<this> {
    return Object.assign(this, attributes)
  }
}

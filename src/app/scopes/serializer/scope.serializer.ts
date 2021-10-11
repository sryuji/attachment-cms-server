// https://github.com/typestack/class-transformer
import { Scope } from '../../../db/entity/scope.entity'
import { BaseSerializer } from '../../base/base.serializer'
import { Expose, Type } from 'class-transformer'

export class ExposedScope extends Scope {
  @Expose({ name: 'token' })
  getToken(): string {
    return this.token
  }
}

export class ScopeSerializer extends BaseSerializer {
  @Type(() => ExposedScope)
  scope: ExposedScope

  public serialize({ scope }: { scope: Scope }): this {
    this.scope = new ExposedScope(scope)
    return this
  }
}

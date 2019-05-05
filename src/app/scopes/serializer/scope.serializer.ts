// https://github.com/typestack/class-transformer
import { Scope } from '../../../db/entity/scope.entity'
import { BaseSerializer } from '../../base/base.serializer'
import { Expose, Type } from 'class-transformer'

// EntityのSerialize設定を使わず、個別にserialize仕方を変えたい場合は上書きで設定
export class ExposedScope extends Scope {
  // @Excludeされてるpropertyは、個別でgetterを用意する必要がある
  @Expose({ name: 'token' })
  getToken(): string {
    return this.token
  }
  // 未指定のものに@Excludeするのは下記で良い
  // @Exclude()
  // testDomain: string
}

export class ScopeSerializer extends BaseSerializer {
  @Type(() => ExposedScope)
  scope: ExposedScope

  public serialize({ scope }: { scope: Scope }): this {
    this.scope = new ExposedScope(scope)
    return this
  }
}

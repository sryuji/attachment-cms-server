// https://github.com/typestack/class-transformer
import { Release } from '../../../db/entity/release.entity'
import { ApiResponseModelProperty } from '@nestjs/swagger'
import { BaseSerializer } from '../../base/base.serializer'
import { Expose, Type } from 'class-transformer'
import { Scope } from 'src/db/entity/scope.entity'

class ExposedRelease extends Release {
  @Expose({ name: 'limitedReleaseToken' })
  getLimitedReleaseToken(): string {
    return this.limitedReleaseToken
  }

  // lazy JSON propertyは __scope__となるため、別propertyを定義し、serialize前に入れ直してやる
  @Expose({ name: 'scope' })
  exposedScope: Scope
}

export class ReleaseSerializer extends BaseSerializer {
  @Type(() => ExposedRelease)
  @ApiResponseModelProperty({ type: ExposedRelease })
  release: ExposedRelease

  public async serialize({ release }: { release: Release }): Promise<this> {
    this.release = new ExposedRelease(release)
    this.release.exposedScope = await this.release.scope
    return this
  }
}

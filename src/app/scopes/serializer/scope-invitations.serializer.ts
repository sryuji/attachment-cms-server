import { ApiResponseProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ScopeInvitation } from '../../../db/entity/scope-invitation.entity'
import { CollectionSerializer } from '../../base/collection.serializer'
import { Pager } from '../../base/pager'
import { ScopeInvitationResponse } from './scope-invtation.response'

export class ScopeInvitationsSerializer extends CollectionSerializer {
  @ApiResponseProperty({ type: ScopeInvitationResponse })
  @Type(() => ScopeInvitationResponse)
  scopeInvitations: ScopeInvitationResponse[]

  public serialize(attributes: { scopeInvitations: ScopeInvitation[]; pager: Pager }): this {
    this.pager = attributes.pager
    this.scopeInvitations = attributes.scopeInvitations.map((r) => new ScopeInvitationResponse(r))
    return this
  }
}

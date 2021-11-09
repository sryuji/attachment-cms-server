import { ScopeInvitation } from '../../../db/entity/scope-invitation.entity'
import { Expose } from 'class-transformer'

export class ScopeInvitationResponse extends ScopeInvitation {
  @Expose({ name: 'createdAt' })
  getCreatedAt(): Date {
    return this.createdAt
  }
}

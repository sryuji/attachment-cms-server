import { ApiResponseProperty } from '@nestjs/swagger'
import { ScopeInvitation } from '../../../db/entity/scope-invitation.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class ScopeInvitationSerializer extends BaseSerializer {
  @ApiResponseProperty({ type: ScopeInvitation })
  scopeInvitation: ScopeInvitation
}

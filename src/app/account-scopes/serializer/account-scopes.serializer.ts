import { ApiResponseProperty } from '@nestjs/swagger'
import { AccountScope } from '../../../db/entity/account-scope.entity'
import { CollectionSerializer } from '../../base/collection.serializer'

export class AccountScopesSerializer extends CollectionSerializer {
  @ApiResponseProperty({ type: AccountScope })
  accountScopes: AccountScope[]
}

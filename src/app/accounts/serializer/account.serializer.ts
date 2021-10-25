// https://github.com/typestack/class-transformer
import { Type } from 'class-transformer'
import { Account } from '../../../db/entity/account.entity'
import { BaseSerializer } from '../../base/base.serializer'

export class AccountSerializer extends BaseSerializer {
  @Type(() => Account)
  account: Account
}

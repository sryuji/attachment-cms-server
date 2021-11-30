import { BaseCommand } from './base.command'
import { Logger } from '@nestjs/common'
import { Scope } from '../db/entity/scope.entity'

export default class SampleCommand extends BaseCommand {
  async perform(): Promise<void> {
    const scopes = await Scope.find()
    Logger.log(scopes.map((r) => r.name))

    const scopes2 = await Scope.find({ take: 1 })
    const scope = scopes2 ? scopes2[0] : null
    Logger.log(scope)
  }
}

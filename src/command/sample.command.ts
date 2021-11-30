import { BaseCommand } from './base.command'
import { Logger } from '@nestjs/common'
import { Scope } from '../db/entity/scope.entity'
import { ScopesService } from '../app/scopes/scopes.service'

export default class SampleCommand extends BaseCommand {
  async perform(): Promise<void> {
    const scopes = await Scope.find()
    Logger.log(scopes.map((r) => r.name))

    const service: ScopesService = this.app.get(ScopesService)
    const scopes2 = await service.search({ take: 1 })
    const scope = scopes2 ? scopes2[0] : null
    Logger.log(scope)
  }
}

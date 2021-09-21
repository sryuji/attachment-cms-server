import { BaseCommand } from './base.command'
import { Scope } from 'src/db/entity/scope.entity'
import { Logger } from '@nestjs/common'
import { ScopesService } from 'src/app/scopes/scopes.service'

export default class SampleCommand extends BaseCommand {
  async perform(): Promise<void> {
    const scopes = await Scope.find()
    Logger.log(scopes.map((r) => r.name))

    const service: ScopesService = this.app.get(ScopesService)
    const scopes2 = await service.search({ take: 1 })
    const scope = scopes2 && scopes2[0]
    Logger.log(scope)
  }
}

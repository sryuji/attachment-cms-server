import { Scope } from '../../entity/scope.entity'
import { BaseSeed } from '../base.seed'

export default class ScopeSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      { id: 3, name: 'attachment CMS', domain: 'http://localhost:3000', description: 'desc' },
      { id: 2, name: 'example site', domain: 'http://localhost:3001' },
    ]
    await this.createOrUpdate(seedList, Scope, ['id'])
  }
}

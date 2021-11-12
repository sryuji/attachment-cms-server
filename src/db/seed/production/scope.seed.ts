import { Scope } from '../../entity/scope.entity'
import { BaseSeed } from '../base.seed'

export default class ScopeSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        name: 'お試し用プロジェクト',
        domain: 'https://attachment-cms.dev',
        description:
          'コンテンツ登録やリリースをご自由にお試しください。Projectの編集機能やメンバー操作は制限されています。',
        token: '0601c7e9-af0b-4e1d-a0e7-fde28278e9c2',
      },
    ]
    await this.createOrUpdate(seedList, Scope, ['id'])
  }
}

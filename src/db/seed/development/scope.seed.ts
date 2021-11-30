import { Scope } from '../../entity/scope.entity'
import { BaseSeed } from '../base.seed'

export default class ScopeSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        name: 'お試し用プロジェクト',
        domain: 'http://localhost:3001',
        description:
          'コンテンツ登録やリリースをご自由にお試しください。Projectの編集機能やメンバー操作は制限されています。',
        token: '0601c7e9-af0b-4e1d-a0e7-fde28278e9c2',
      },
      {
        id: 2,
        name: 'attachment CMSサイト',
        domain: 'http://localhost:3001',
        description: 'attachment CMSサイトのHelpなどコンテンツ管理',
        token: '3fcaf9ce-a13f-4435-a0c7-8d2d8a48dc0f',
      },
    ]
    await this.createOrUpdate(seedList, Scope, ['id'])
  }
}

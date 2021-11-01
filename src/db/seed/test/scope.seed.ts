import { Scope } from '../../entity/scope.entity'
import { BaseSeed } from '../base.seed'

export default class ScopeSeed extends BaseSeed {
  async perform(): Promise<void> {
    const seedList = [
      {
        id: 1,
        name: 'サービス利用中',
        domain: 'http://localhost:3001',
        description: 'リリースを１度したことがあり、次のリリース策定中',
      },
      {
        id: 2,
        name: 'サービス利用中 (2)',
        domain: 'http://localhost:3002',
        description: 'リリースを１度したことがあり、次のリリース予定なし',
      },
      { id: 3, name: 'サービス利用開始の作業中', domain: null, description: 'まだ未リリースでコンテンツの登録中' },
      { id: 4, name: 'お試し開始', domain: null, description: 'Scopeだけ登録した状態' },
    ]
    await this.createOrUpdate(seedList, Scope, ['id'])
  }
}

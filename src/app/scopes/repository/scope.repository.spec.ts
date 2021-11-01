import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../../../config/config.module'
import { TypeOrmConfigService } from '../../../config/typeorm.config.service'

import { ScopeRepository } from './scope.repository'

describe('ScopeRepository', () => {
  let repository: ScopeRepository

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TypeOrmModule.forFeature([ScopeRepository]),
      ],
    }).compile()

    repository = app.get<ScopeRepository>(ScopeRepository)
  })

  describe('#findAll', () => {
    it('return scopes', async () => {
      const [scopeIds, page, per] = [[1, 2], 1, 1]
      const [scopes, pager] = await repository.findAll(scopeIds, page, per)
      expect(scopes.length).toEqual(1)
      expect(pager.totalCount).toEqual(2)
    })
  })
})

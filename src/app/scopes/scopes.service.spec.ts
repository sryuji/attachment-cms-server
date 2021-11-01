import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../../config/config.module'
import { TypeOrmConfigService } from '../../config/typeorm.config.service'
import { AccountScope } from '../../db/entity/account-scope.entity'
import { ScopeDto } from './dto/scope.dto'
import { ScopeRepository } from './repository/scope.repository'

import { ScopesService } from './scopes.service'

describe('ScopesService', () => {
  let service: ScopesService

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TypeOrmModule.forFeature([ScopeRepository, AccountScope]),
      ],
      providers: [ScopesService],
    }).compile()

    service = app.get<ScopesService>(ScopesService)
  })

  describe('#findAll', () => {
    it('return scopes', async () => {
      const accountId = 1
      const dto: Partial<ScopeDto> = { name: 'test', domain: 'https://test.com', description: '説明' }
      const scope = await service.createWithAccountId(dto, accountId)
      expect(scope.id).toBeDefined()
      expect(scope.domain).toEqual(dto.domain)
      expect(scope.description).toEqual(dto.description)
    })
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { AccountScopesController } from './account-scopes.controller'

describe('AccountScopesController', () => {
  let controller: AccountScopesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountScopesController],
    }).compile()

    controller = module.get<AccountScopesController>(AccountScopesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})

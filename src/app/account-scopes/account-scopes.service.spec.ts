import { Test, TestingModule } from '@nestjs/testing';
import { AccountScopesService } from './account-scopes.service';

describe('AccountScopesService', () => {
  let service: AccountScopesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountScopesService],
    }).compile();

    service = module.get<AccountScopesService>(AccountScopesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

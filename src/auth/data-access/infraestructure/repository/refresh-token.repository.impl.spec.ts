import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenRepositoryImpl } from './refresh-token.repository.impl';

describe('RefreshTokenRepositoryImpl', () => {
  let repository: RefreshTokenRepositoryImpl;
  let mockKnex: any;

  beforeEach(async () => {
    mockKnex = {
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenRepositoryImpl,
        {
          provide: 'default_KnexModuleConnectionToken',
          useValue: mockKnex,
        },
      ],
    }).compile();

    repository = module.get<RefreshTokenRepositoryImpl>(
      RefreshTokenRepositoryImpl,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should get stored tokens', async () => {
    const id = '123';
    await repository.getStoredTokens(id);
    expect(mockKnex.from).toHaveBeenCalledWith('conta');
    expect(mockKnex.select).toHaveBeenCalledWith('refresh_token');
    expect(mockKnex.where).toHaveBeenCalledWith({ id_entregador: id });
  });
});

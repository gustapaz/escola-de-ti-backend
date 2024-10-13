import { Test, TestingModule } from '@nestjs/testing';
import { ItemCarrinhoRepositoryImpl } from './item-carrinho.repository.impl';
import { NotFoundException } from '@nestjs/common';

describe('ItemCarrinhoRepositoryImpl', () => {
  let repository: ItemCarrinhoRepositoryImpl;
  let mockKnex: any;

  beforeEach(async () => {
    mockKnex = {
      knex: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      returning: jest.fn(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemCarrinhoRepositoryImpl,
        {
          provide: 'default_KnexModuleConnectionToken',
          useValue: mockKnex,
        },
      ],
    }).compile();

    repository = module.get<ItemCarrinhoRepositoryImpl>(
      ItemCarrinhoRepositoryImpl,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});

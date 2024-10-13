import { Test, TestingModule } from '@nestjs/testing';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { CreateCarrinhoUseCase } from './create-carrinho.use-case';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateCarrinhoUseCase', () => {
  let service: CreateCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let input: string;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
      ],
    }).compile();

    service = module.get<CreateCarrinhoUseCase>(CreateCarrinhoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create carrinho', async () => {
    input = '1';
    await service.create(input);
    expect(mockCarrinhoRepository.create).toBeCalledWith(input);
  });

  it('should throw InternalServerErrorException when repository throws', async () => {
    input = '1';
    mockCarrinhoRepository.create.mockRejectedValue(new Error('Fake error'));
    await expect(service.create(input)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

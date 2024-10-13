import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { DeleteCarrinhoUseCase } from './delete-carrinho.use-case';

describe('DeleteCarrinhoUseCase', () => {
  let service: DeleteCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let input: string;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteCarrinhoUseCase>(DeleteCarrinhoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete carrinho', async () => {
    input = '1';
    await service.delete(input);
    expect(mockCarrinhoRepository.delete).toBeCalledWith(input);
  });

  it('should throw InternalServerErrorException when repository throws', async () => {
    input = '1';
    mockCarrinhoRepository.delete.mockRejectedValue(new Error('Fake error'));
    await expect(service.delete(input)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

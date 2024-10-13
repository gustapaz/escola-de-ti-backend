import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { CARRINHO_FIND_ITENS_BY_ID_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';
import { DeleteItemCarrinhoUseCase } from './delete-item-carrinho.use-case';

describe('DeleteItemCarrinhoUseCase', () => {
  let service: DeleteItemCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let mockFindItensById: jest.Mocked<IFindById<FindItensCarrinhoResponseDto>>;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      deleteItemCarrinho: jest.fn(),
      addCarrinho: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    mockFindItensById = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<FindItensCarrinhoResponseDto>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteItemCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
        {
          provide: CARRINHO_FIND_ITENS_BY_ID_PROVIDER,
          useValue: mockFindItensById,
        },
      ],
    }).compile();

    service = module.get<DeleteItemCarrinhoUseCase>(DeleteItemCarrinhoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when repository throws', async () => {
    const id_itens = '1';
    const id_motoboy = '1';
    mockFindItensById.findById.mockRejectedValue(
        new Error('Fake error'),
    );
    await expect(
      service.deleteItensCarrinho(id_itens, id_motoboy),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FindItensCarrinhoUseCase } from './find-item-by-id-carrinho.use-case';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { InternalServerErrorException } from '@nestjs/common';
import {
  ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
  PRODUCTS_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { IFindAllById } from '../../../shared/interfaces/find-all-by-id.interface';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { ItemCarrinho } from '../../../item-carrinho/domain/entities/item-carrinho.entity';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';

describe('FindItensCarrinhoResponseDto', () => {
  let service: FindItensCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let mockProducts: jest.Mocked<IFindById<any>>;
  let mockFindAllById: jest.Mocked<IFindAllById<ItemCarrinho>>;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      findByIdMotoboy: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    mockFindAllById = {
      findAllById: jest.fn(),
    } as unknown as jest.Mocked<IFindAllById<ItemCarrinho>>;

    mockProducts = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<any>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindItensCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
        {
          provide: ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
          useValue: mockFindAllById,
        },
        {
          provide: PRODUCTS_FIND_BY_ID_PROVIDER,
          useValue: mockProducts,
        },
      ],
    }).compile();

    service = module.get<FindItensCarrinhoUseCase>(FindItensCarrinhoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when repository throws', async () => {
    const id_motoboy = '1';
    mockCarrinhoRepository.findByIdMotoboy.mockRejectedValue(
      new Error('Fake error'),
    );
    await expect(service.findById(id_motoboy)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

describe('FindItensCarrinhoDto', () => {
  it('should be defined', () => {
    expect(FindItensCarrinhoResponseDto).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { ICreate } from '../../../shared/interfaces/create.interface';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { IFindAllById } from '../../../shared/interfaces/find-all-by-id.interface';
import {
  ITEM_CARRINHO_CREATE_PROVIDER,
  ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
  PRODUCTS_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { CreateItemCarrinhoDto } from '../../../item-carrinho/domain/dto/create-item-carrinho.dto';
import { ItemCarrinho } from '../../../item-carrinho/domain/entities/item-carrinho.entity';
import { AddCarrinhoUseCase } from './add-carrinho.use-case';

describe('AddCarrinhoUseCase', () => {
  let service: AddCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let mockProducts: jest.Mocked<IFindById<any>>;
  let mockCreateItemCarrinho: jest.Mocked<
    ICreate<CreateItemCarrinhoDto, ItemCarrinho>
  >;
  let mockFindAllById: jest.Mocked<IFindAllById<ItemCarrinho>>;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      findByIdMotoboy: jest.fn(),
      addCarrinho: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    mockProducts = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<any>>;

    mockCreateItemCarrinho = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ICreate<CreateItemCarrinhoDto, ItemCarrinho>>;

    mockFindAllById = {
      findAllById: jest.fn(),
    } as unknown as jest.Mocked<IFindAllById<ItemCarrinho>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
        {
          provide: PRODUCTS_FIND_BY_ID_PROVIDER,
          useValue: mockProducts,
        },
        {
          provide: ITEM_CARRINHO_CREATE_PROVIDER,
          useValue: mockCreateItemCarrinho,
        },
        {
          provide: ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
          useValue: mockFindAllById,
        },
      ],
    }).compile();

    service = module.get<AddCarrinhoUseCase>(AddCarrinhoUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException when product is not found', async () => {
    mockProducts.findById.mockResolvedValue(null);

    await expect(
      service.addCarrinho('1', '1', { quantidade: 1 }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when quantidade is bigger than stock', async () => {
    mockProducts.findById.mockResolvedValue({
      id: '1',
      nome: 'nmoe',
      descricao: 'descricao',
      valor: 5,
      status: true,
      imagem: {
        id: '22',
        url: 'url',
        id_origem: '1',
      },
      stock: {
        id: '3',
        id_produto: '1',
        quantidade: 20,
      },
    });

    await expect(async () => {
      await service.addCarrinho('1', '2', { quantidade: 30 });
    }).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockProducts.findById.mockResolvedValue({
      id: '1',
      nome: 'nome',
      descricao: 'descricao',
      valor: 5,
      status: true,
      imagem: {
        id: '22',
        url: 'url',
        id_origem: '1',
      },
      stock: {
        id: '3',
        id_produto: '1',
        quantidade: 20,
      },
    });
    mockCarrinhoRepository.findByIdMotoboy.mockResolvedValue({
      id: '2',
      id_entregador: '3',
      valor_total: 40,
      status: true,
      data_de_compra: '12/02/2033',
    });
    mockCreateItemCarrinho.create.mockRejectedValue(new Error('Fake error'));
    await expect(
      service.addCarrinho('1', '2', { quantidade: 5 }),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

describe('UpdateCarrinhoDto', () => {
  it('should be defined', () => {
    expect(UpdateCarrinhoDto).toBeDefined();
  });
});

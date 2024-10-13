import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
} from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import { Motoboy } from '../../../motoboy/domain/entities/motoboy.entity';
import { UpdateStockDto } from '../../../stock/domain/dto/update-stock.dto';
import {
  CARRINHO_FIND_ITENS_BY_ID_PROVIDER,
  STOCK_UPDATE_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
  MOTOBOY_UPDATE_PROVIDER,
  MOTOBOY_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';
import { FinishCompraCarrinhoUseCase } from './finish-compra-carrinho.use-case';

describe('FinishCompraCarrinhoUseCase', () => {
  let service: FinishCompraCarrinhoUseCase;
  let mockCarrinhoRepository: jest.Mocked<CarrinhoRepository>;
  let mockFindItensById: jest.Mocked<IFindById<FindItensCarrinhoResponseDto>>;
  let mockUpdateStock: jest.Mocked<IUpdate<UpdateStockDto, Stock>>;
  let mockFindByIdStock: jest.Mocked<IFindById<Stock>>;
  let mockUpdateMotoboy: jest.Mocked<IUpdate<any, Motoboy>>;
  let mockFindByIdMotoboy: jest.Mocked<IFindById<Motoboy>>;

  beforeEach(async () => {
    mockCarrinhoRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<CarrinhoRepository>;

    mockFindItensById = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<FindItensCarrinhoResponseDto>>;

    mockUpdateStock = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUpdate<UpdateStockDto, Stock>>;

    mockFindByIdStock = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<Stock>>;

    mockUpdateMotoboy = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUpdate<any, Motoboy>>;

    mockFindByIdMotoboy = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<Motoboy>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinishCompraCarrinhoUseCase,
        {
          provide: CarrinhoRepository,
          useValue: mockCarrinhoRepository,
        },
        {
          provide: CARRINHO_FIND_ITENS_BY_ID_PROVIDER,
          useValue: mockFindItensById,
        },
        {
          provide: STOCK_UPDATE_PROVIDER,
          useValue: mockUpdateStock,
        },
        {
          provide: STOCK_FIND_BY_ID_PROVIDER,
          useValue: mockFindByIdStock,
        },
        {
          provide: MOTOBOY_UPDATE_PROVIDER,
          useValue: mockUpdateMotoboy,
        },
        {
          provide: MOTOBOY_FIND_BY_ID_PROVIDER,
          useValue: mockFindByIdMotoboy,
        },
      ],
    }).compile();

    service = module.get<FinishCompraCarrinhoUseCase>(
      FinishCompraCarrinhoUseCase,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an BadRequestException if the stock quantity is insufficient', async () => {
    mockCarrinhoRepository.findById.mockResolvedValue({
      id: '1',
      id_entregador: '1',
      valor_total: 100,
      status: true,
      data_de_compra: '12/12/2021',
    });

    mockFindItensById.findById.mockResolvedValue({
      id: '1',
      valor_total: 100,
      itens: [
        {
          id_produto: '1',
          quantidade: 1,
          valor: 100,
        },
      ],
    });

    mockFindByIdStock.findById.mockResolvedValue({
      id: '1',
      id_produto: '1',
      quantidade: 0,
    });

    await expect(service.finishCompra('1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an BadRequestException if the motoboy is not found', async () => {
    mockCarrinhoRepository.findById.mockResolvedValue({
      id: '1',
      id_entregador: '1',
      valor_total: 100,
      status: true,
      data_de_compra: '12/12/2021',
    });

    mockFindItensById.findById.mockResolvedValue({
      id: '1',
      valor_total: 100,
      itens: [
        {
          id_produto: '1',
          quantidade: 1,
          valor: 100,
        },
      ],
    });

    mockFindByIdStock.findById.mockResolvedValue({
      id: '1',
      id_produto: '1',
      quantidade: 1,
    });

    mockFindByIdMotoboy.findById.mockResolvedValue(null);

    await expect(service.finishCompra('1')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an BadRequestException if the motoboy has insufficient aiqcoins', async () => {
    mockCarrinhoRepository.findById.mockResolvedValue({
      id: '1',
      id_entregador: '1',
      valor_total: 100,
      status: true,
      data_de_compra: '12/12/2021',
    });

    mockFindItensById.findById.mockResolvedValue({
      id: '1',
      valor_total: 100,
      itens: [
        {
          id_produto: '1',
          quantidade: 1,
          valor: 100,
        },
      ],
    });

    mockFindByIdStock.findById.mockResolvedValue({
      id: '1',
      id_produto: '1',
      quantidade: 1,
    });

    mockFindByIdMotoboy.findById.mockResolvedValue({
      id: '1',
      nome: 'Nome Teste',
      sobrenome: 'Sobrenome Teste',
      cpf: '123.456.789-01',
      cnpj: '12.345.678/0001-90',
      email: 'teste@email.com',
      telefone: '(11) 12345-6789',
      data_de_nascimento: '01/01/2000',
      senha: 'senhaTeste123',
      data_de_cadastro: '01/01/2021',
      mochila: true,
      status: true,
      token_dispositivo: 'tokenTeste',
      aiqcoins: 0,
      entregas_realizadas: 5,
      cidade: 'Cidade Teste',
    });

    await expect(service.finishCompra('1')).rejects.toThrow(
      BadRequestException,
    );
  });
});

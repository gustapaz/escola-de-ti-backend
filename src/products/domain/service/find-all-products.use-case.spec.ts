import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../repository/products.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import {
  IMAGEN_FIND_BY_ID_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import { FindAllProductsUseCase } from './find-all-products.use-case';

describe('FindAllProductsUseCase', () => {
  let service: FindAllProductsUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    const mockImageFindByIdProvider = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<Imagen>>;

    const mcockStockFindByIdProvider = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<Stock>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllProductsUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: IMAGEN_FIND_BY_ID_PROVIDER,
          useValue: mockImageFindByIdProvider,
        },
        {
          provide: STOCK_FIND_BY_ID_PROVIDER,
          useValue: mcockStockFindByIdProvider,
        },
      ],
    }).compile();

    service = module.get<FindAllProductsUseCase>(FindAllProductsUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockProductRepository.findAll.mockRejectedValue(new Error());

    await expect(service.findAll()).rejects.toThrowError();
  });
});

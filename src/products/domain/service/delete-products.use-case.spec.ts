import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../repository/products.repository';
import { DeleteProductsUseCase } from './delete-products.use-case';
import { IDelete } from '../../../shared/interfaces/delete.interface';
import {
  IMAGEN_DELETE_PROVIDER,
  STOCK_DELETE_PROVIDER,
} from '../../../shared/constants/injection-tokens';

describe('DeleteProductsUseCase', () => {
  let service: DeleteProductsUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  beforeEach(async () => {
    mockProductRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    const mockImageDeleteProvider = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IDelete<void>>;

    const mcockStockDeleteProvider = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IDelete<void>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductsUseCase,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
        {
          provide: IMAGEN_DELETE_PROVIDER,
          useValue: mockImageDeleteProvider,
        },
        {
          provide: STOCK_DELETE_PROVIDER,
          useValue: mcockStockDeleteProvider,
        },
      ],
    }).compile();

    service = module.get<DeleteProductsUseCase>(DeleteProductsUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockProductRepository.delete.mockRejectedValue(new Error());

    await expect(service.delete('1')).rejects.toThrowError();
  });
});

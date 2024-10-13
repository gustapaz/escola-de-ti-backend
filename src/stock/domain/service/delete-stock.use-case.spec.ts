import { Test, TestingModule } from '@nestjs/testing';
import { StockRepository } from '../repository/stock.repository';
import { DeleteStockUseCase } from './delete-stock.use-case';

describe('DeleteStockUseCase', () => {
  let service: DeleteStockUseCase;
  let mockStockRepository: jest.Mocked<StockRepository>;

  beforeEach(async () => {
    mockStockRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<StockRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteStockUseCase,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteStockUseCase>(DeleteStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockStockRepository.delete.mockRejectedValue(new Error('Fake error'));

    await expect(service.delete('1')).rejects.toThrowError();
  });
});


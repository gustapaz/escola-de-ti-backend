import { Test, TestingModule } from '@nestjs/testing';
import { StockRepository } from '../repository/stock.repository';
import { FindAllStockUseCase } from './find-all-stock.use-case';

describe('FindAllStockUseCase', () => {
  let service: FindAllStockUseCase;
  let mockStockRepository: jest.Mocked<StockRepository>;

  beforeEach(async () => {
    mockStockRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<StockRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllStockUseCase,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllStockUseCase>(FindAllStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockStockRepository.findAll.mockRejectedValue(new Error('Fake error'));

    await expect(service.findAll()).rejects.toThrowError();
  });
});
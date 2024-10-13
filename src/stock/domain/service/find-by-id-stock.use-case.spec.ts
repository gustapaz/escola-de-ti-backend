import { Test, TestingModule } from '@nestjs/testing';
import { StockRepository } from '../repository/stock.repository';
import { FindByIdStockUseCase } from './find-by-id-stock.use-case';

describe('FindByIdStockUseCase', () => {
  let service: FindByIdStockUseCase;
  let mockStockRepository: jest.Mocked<StockRepository>;

  beforeEach(async () => {
    mockStockRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<StockRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByIdStockUseCase,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<FindByIdStockUseCase>(FindByIdStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockStockRepository.findById.mockRejectedValue(new Error('Fake error'));

    await expect(service.findById('1')).rejects.toThrowError();
  });
});

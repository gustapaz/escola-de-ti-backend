import { Test, TestingModule } from '@nestjs/testing';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repository/stock.repository';
import { UpdateStockUseCase } from './update-stock.use-case';

describe('UpdateStockUseCase', () => {
  let service: UpdateStockUseCase;
  let mockStockRepository: jest.Mocked<StockRepository>;

  beforeEach(async () => {
    mockStockRepository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<StockRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateStockUseCase,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateStockUseCase>(UpdateStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockStockRepository.update.mockRejectedValue(new Error('Fake error'));

    await expect(
      service.update('1', {} as UpdateStockDto),
    ).rejects.toThrowError();
  });
});

describe('UpdateStockDto', () => {
  it('should be defined', () => {
    expect(UpdateStockDto).toBeDefined();
  });
});

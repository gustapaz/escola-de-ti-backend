import { Test, TestingModule } from '@nestjs/testing';
import { CreateStockDto } from '../dto/create-stock.dto';
import { StockRepository } from '../repository/stock.repository';
import { CreateStockUseCase } from './create-stock.use-case';

describe('CreateStockUseCase', () => {
  let service: CreateStockUseCase;
  let mockStockRepository: jest.Mocked<StockRepository>;

  beforeEach(async () => {
    mockStockRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<StockRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStockUseCase,
        {
          provide: StockRepository,
          useValue: mockStockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateStockUseCase>(CreateStockUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockStockRepository.create.mockRejectedValue(new Error('Fake error'));

    await expect(service.create({} as CreateStockDto)).rejects.toThrowError();
  });
});

describe('CreateStockDto', () => {
  it('should be defined', () => {
    expect(CreateStockDto).toBeDefined();
  });

});

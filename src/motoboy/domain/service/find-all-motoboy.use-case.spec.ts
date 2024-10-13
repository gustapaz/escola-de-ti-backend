import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { FindAllMotoboyUseCase } from './find-all-motoboy.use-case';

describe('FindAllMotoboyUseCase', () => {
  let service: FindAllMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllMotoboyUseCase>(FindAllMotoboyUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.findAll.mockRejectedValue(new Error('Fake error'));

    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

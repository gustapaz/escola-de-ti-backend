import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { FindByIdMotoboyUseCase } from './find-by-id-motoboy.use-case';

describe('FindByIdMotoboyUseCase', () => {
  let service: FindByIdMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByIdMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<FindByIdMotoboyUseCase>(FindByIdMotoboyUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.findById.mockRejectedValue(new Error('Fake error'));

    await expect(service.findById('1')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

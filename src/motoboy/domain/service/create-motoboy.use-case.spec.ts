import { Test, TestingModule } from '@nestjs/testing';
import { CreateMotoboyUseCase } from './create-motoboy.use-case';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateMotoboyUseCase', () => {
  let service: CreateMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<CreateMotoboyUseCase>(CreateMotoboyUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.create.mockRejectedValue(new Error('Fake error'));

    await expect(service.create({} as any)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

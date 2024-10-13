import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { DeleteMotoboyUseCase } from './delete-motoboy.use-case';

describe('DeleteMotoboyUseCase', () => {
  let service: DeleteMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteMotoboyUseCase>(DeleteMotoboyUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.delete.mockRejectedValue(new Error('Fake error'));

    await expect(service.delete('1')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

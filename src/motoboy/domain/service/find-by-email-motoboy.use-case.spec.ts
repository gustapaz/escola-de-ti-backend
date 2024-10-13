import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { FindByEmailMotoboyUseCase } from './find-by-email-motoboy.use-case';

describe('FindByEmailMotoboyUseCase', () => {
  let service: FindByEmailMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByEmailMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<FindByEmailMotoboyUseCase>(FindByEmailMotoboyUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.findByEmail.mockRejectedValue(
      new Error('Fake error'),
    );

    await expect(service.findByEmail('fakeMail@gmail.com')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

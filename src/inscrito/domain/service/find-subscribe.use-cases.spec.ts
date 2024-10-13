import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { FindSubscribeUseCase } from './find-subscribe.use-cases';

describe('FindSubscribeUseCase', () => {
  let findSubscribeUseCase: FindSubscribeUseCase;
  let mockSubscribeRepository: Partial<jest.Mocked<SubscribeRepository>>;

  beforeEach(async () => {
    mockSubscribeRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindSubscribeUseCase,
        {
          provide: SubscribeRepository,
          useValue: mockSubscribeRepository,
        },
      ],
    }).compile();

    findSubscribeUseCase = module.get<FindSubscribeUseCase>(
      FindSubscribeUseCase,
    );
  });

  it('should be defined', () => {
    expect(findSubscribeUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when SubscribeRepository.findAll fails', async () => {
    mockSubscribeRepository.findAll.mockRejectedValueOnce(
      new Error('Erro ao buscar Inscritos'),
    );

    await expect(findSubscribeUseCase.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when SubscribeRepository.findOne fails', async () => {
    const mockSubscribeId = 'mockId';

    mockSubscribeRepository.findOne.mockRejectedValueOnce(
      new Error('Erro ao buscar Inscrito por id'),
    );

    await expect(
      findSubscribeUseCase.findOne(mockSubscribeId),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

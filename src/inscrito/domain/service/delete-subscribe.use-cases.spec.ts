import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { DeleteSubscribeUseCase } from './delete-subscribe.use-cases';

describe('DeleteSubscribeUseCase', () => {
  let deleteSubscribeUseCase: DeleteSubscribeUseCase;
  let mockSubscribeRepository: Partial<jest.Mocked<SubscribeRepository>>;

  beforeEach(async () => {
    mockSubscribeRepository = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSubscribeUseCase,
        {
          provide: SubscribeRepository,
          useValue: mockSubscribeRepository,
        },
      ],
    }).compile();

    deleteSubscribeUseCase = module.get<DeleteSubscribeUseCase>(
      DeleteSubscribeUseCase,
    );
  });

  it('should be defined', () => {
    expect(deleteSubscribeUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when SubscribeRepository.delete fails', async () => {
    const mockSubscribeId = 'mockId';

    mockSubscribeRepository.delete.mockRejectedValueOnce(
      new Error('Erro ao deletar Inscrito'),
    );

    await expect(
      deleteSubscribeUseCase.delete(mockSubscribeId),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

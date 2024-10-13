import { Test, TestingModule } from '@nestjs/testing';
import { DeleteObjectiveUseCase } from './delete-objective.use-cases';
import { ObjectiveRepository } from '../repository/objective.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { IMAGEN_DELETE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IDelete } from '../../../shared/interfaces/delete.interface';

describe('DeleteObjectiveUseCase', () => {
  let deleteObjectiveUseCase: DeleteObjectiveUseCase;
  let mockObjectiveRepository: Partial<jest.Mocked<ObjectiveRepository>>;

  beforeEach(async () => {
    mockObjectiveRepository = {
      delete: jest.fn(),
    };

    const mockImageDeleteProvider = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IDelete<void>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteObjectiveUseCase,
        {
          provide: ObjectiveRepository,
          useValue: mockObjectiveRepository,
        },
        {
          provide: IMAGEN_DELETE_PROVIDER,
          useValue: mockImageDeleteProvider,
        },
      ],
    }).compile();

    deleteObjectiveUseCase = module.get<DeleteObjectiveUseCase>(
      DeleteObjectiveUseCase,
    );
  });

  it('should be defined', () => {
    expect(deleteObjectiveUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when objectiveRepository.delete fails', async () => {
    const mockObjectiveId = 'mockId';

    mockObjectiveRepository.delete.mockRejectedValueOnce(
      new InternalServerErrorException('Erro ao deletar objetivo'),
    );

    await expect(
      deleteObjectiveUseCase.delete(mockObjectiveId),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

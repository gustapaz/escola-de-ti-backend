import { Test, TestingModule } from '@nestjs/testing';
import { UpdateMetaUseCase } from './update-meta.use-case';
import { MetaRepository } from '../repository/meta.repository';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateMetaDto } from '../dto/update-meta.dto';
import { ObjectiveRepository } from '../../../objetivo/domain/repository/objective.repository';

describe('UpdateMetaUseCase', () => {
  let updateMetaUseCase: UpdateMetaUseCase;
  let mockMetaRepository: Partial<jest.Mocked<MetaRepository>>;
  let mockObjectiveRepository: Partial<jest.Mocked<ObjectiveRepository>>;

  beforeEach(async () => {
    mockMetaRepository = {
      update: jest.fn(),
    };
    mockObjectiveRepository = {
      findOne: jest.fn().mockResolvedValue({
        meta: 0,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMetaUseCase,
        {
          provide: MetaRepository,
          useValue: mockMetaRepository,
        },
        {
          provide: ObjectiveRepository,
          useValue: mockObjectiveRepository,
        },
      ],
    }).compile();

    updateMetaUseCase = module.get<UpdateMetaUseCase>(UpdateMetaUseCase);
  });

  it('should be defined', () => {
    expect(updateMetaUseCase).toBeDefined();
  });

  it('should throw NotFoundException when the objective is not found', async () => {
    const mockIdObjetivo = '1';
    const mockIdInscrito = '1';
    const mockMetaDto: UpdateMetaDto = {
      id_inscrito: '1',
      id_campanha: '1',
      id_objetivo: '1',
      valor_atingido: 25,
    };

    mockObjectiveRepository.findOne.mockResolvedValue(undefined);

    await expect(
      updateMetaUseCase.update(mockIdObjetivo, mockIdInscrito, mockMetaDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException when metaRepository.update fails', async () => {
    const mockIdObjetivo = '1';
    const mockIdInscrito = '1';

    mockMetaRepository.update.mockRejectedValueOnce(
      new Error('Erro ao atualizar meta'),
    );

    const mockMetaDto: UpdateMetaDto = {
      id_inscrito: '1',
      id_campanha: '1',
      id_objetivo: '1',
      valor_atingido: 0.5,
    };

    await expect(
      updateMetaUseCase.update(mockIdObjetivo, mockIdInscrito, mockMetaDto),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

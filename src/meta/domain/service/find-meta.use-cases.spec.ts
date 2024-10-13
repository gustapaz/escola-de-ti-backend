import { Test, TestingModule } from '@nestjs/testing';
import { FindMetaUseCase } from './find-meta.use-cases';
import { MetaRepository } from '../repository/meta.repository';
import { InternalServerErrorException } from '@nestjs/common';

describe('FindMetaUseCase', () => {
  let findMetaUseCase: FindMetaUseCase;
  let mockMetaRepository: Partial<jest.Mocked<MetaRepository>>;

  beforeEach(async () => {
    mockMetaRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindMetaUseCase,
        {
          provide: MetaRepository,
          useValue: mockMetaRepository,
        },
      ],
    }).compile();

    findMetaUseCase = module.get<FindMetaUseCase>(FindMetaUseCase);
  });

  it('should be defined', () => {
    expect(findMetaUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when metaRepository.findAll fails', async () => {
    mockMetaRepository.findAll.mockRejectedValueOnce(
      new Error('Erro ao buscar metas'),
    );

    await expect(findMetaUseCase.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when metaRepository.findOne fails', async () => {
    const mockIdObjetivo = 'mockObjetivoId';
    const mockIdInscrito = 'mockInscritoId';

    mockMetaRepository.findOne.mockRejectedValueOnce(
      new Error('Erro ao buscar meta por id'),
    );

    await expect(
      findMetaUseCase.findOne(mockIdObjetivo, mockIdInscrito),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateMetaUseCase } from './create-meta.use-cases';
import { MetaRepository } from '../repository/meta.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateMetaDto } from '../dto/create-meta.dto';

describe('CreateMetaUseCase', () => {
  let createMetaUseCase: CreateMetaUseCase;
  let mockMetaRepository: Partial<jest.Mocked<MetaRepository>>;

  beforeEach(async () => {
    mockMetaRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMetaUseCase,
        {
          provide: MetaRepository,
          useValue: mockMetaRepository,
        },
      ],
    }).compile();

    createMetaUseCase = module.get<CreateMetaUseCase>(CreateMetaUseCase);
  });

  it('should be defined', () => {
    expect(createMetaUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when metaRepository.create fails', async () => {
    mockMetaRepository.create.mockRejectedValueOnce(
      new Error('Erro ao criar meta'),
    );

    const mockMetaDto: CreateMetaDto = {
      id_inscrito: '1',
      id_campanha: '1',
      id_objetivo: '1',
      valor_atingido: 25,
    };

    await expect(createMetaUseCase.create(mockMetaDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateObjectiveUseCase } from './create-objective.use-cases';
import { ObjectiveRepository } from '../repository/objective.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateObjectiveDto } from '../dto/create-objective.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IMAGEN_CREATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { ICreate } from '../../../shared/interfaces/create.interface';

describe('CreateObjectiveUseCase', () => {
  let createObjectiveUseCase: CreateObjectiveUseCase;
  let mockObjectiveRepository: Partial<jest.Mocked<ObjectiveRepository>>;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;

  beforeEach(async () => {
    mockObjectiveRepository = {
      create: jest.fn(),
    };

    mockCloudinaryUseCase = {
      uploadImage: jest.fn(),
      cloudinaryProvider: {} as any,
    } as unknown as jest.Mocked<CloudinaryUseCase>;

    const mockImageCreateProvider = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ICreate<CreateImagenDto, Imagen>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateObjectiveUseCase,
        {
          provide: ObjectiveRepository,
          useValue: mockObjectiveRepository,
        },
        {
          provide: CloudinaryUseCase,
          useValue: mockCloudinaryUseCase,
        },
        {
          provide: IMAGEN_CREATE_PROVIDER,
          useValue: mockImageCreateProvider,
        },
      ],
    }).compile();

    createObjectiveUseCase = module.get<CreateObjectiveUseCase>(
      CreateObjectiveUseCase,
    );
  });

  it('should be defined', () => {
    expect(createObjectiveUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when objectiveRepository.create fails', async () => {
    mockObjectiveRepository.create.mockRejectedValueOnce(
      new Error('Erro ao criar objetivo'),
    );

    const mockObjectiveDto: CreateObjectiveDto = {
      id_campanha: '1',
      titulo: 'Teste',
      descricao: 'Teste',
      premio_associado: 25,
      meta: 25,
    };

    await expect(
      createObjectiveUseCase.create(mockObjectiveDto, {} as Express.Multer.File),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

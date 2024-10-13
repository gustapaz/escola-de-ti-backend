import { Test, TestingModule } from '@nestjs/testing';
import { UpdateObjectiveUseCase } from './update-objective.use-case';
import { ObjectiveRepository } from '../repository/objective.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateObjectiveDto } from '../dto/update-objective.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { IMAGEN_UPDATE_PROVIDER } from '../../../shared/constants/injection-tokens';

describe('UpdateObjectiveUseCase', () => {
  let updateObjectiveUseCase: UpdateObjectiveUseCase;
  let mockObjectiveRepository: Partial<jest.Mocked<ObjectiveRepository>>;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;

  beforeEach(async () => {
    mockObjectiveRepository = {
      update: jest.fn(),
    };

    mockCloudinaryUseCase = {
      uploadImage: jest.fn(),
      cloudinaryProvider: {} as any,
    } as unknown as jest.Mocked<CloudinaryUseCase>;

    const mockImageUpdateProvider = {
      update: jest.fn(),
    } as unknown as jest.Mocked<IUpdate<UpdateImagenDto, Imagen>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateObjectiveUseCase,
        {
          provide: ObjectiveRepository,
          useValue: mockObjectiveRepository,
        },
        {
          provide: CloudinaryUseCase,
          useValue: mockCloudinaryUseCase,
        },
        {
          provide: IMAGEN_UPDATE_PROVIDER,
          useValue: mockImageUpdateProvider,
        },
      ],
    }).compile();

    updateObjectiveUseCase = module.get<UpdateObjectiveUseCase>(
      UpdateObjectiveUseCase,
    );
  });

  it('should be defined', () => {
    expect(updateObjectiveUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when objectiveRepository.update fails', async () => {
    const mockObjectiveId = 'mockId';

    mockObjectiveRepository.update.mockRejectedValueOnce(
      new Error('Erro ao atualizar objetivo'),
    );

    const mockObjectiveDto: UpdateObjectiveDto = {
      id_campanha: '1',
      titulo: 'Teste',
      descricao: 'Teste',
      premio_associado: 25,
      meta: 25,
    };

    await expect(
      updateObjectiveUseCase.update(mockObjectiveId, mockObjectiveDto, {} as Express.Multer.File),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

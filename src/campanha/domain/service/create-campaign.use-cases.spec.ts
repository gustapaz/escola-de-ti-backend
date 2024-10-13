import { Test, TestingModule } from '@nestjs/testing';
import { CreateCampaignUseCase } from './create-campaign.use-cases';
import { CampaignRepository } from '../repository/campaign.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IMAGEN_CREATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { ICreate } from '../../../shared/interfaces/create.interface';

describe('CreateCampaignUseCase', () => {
  let createCampaignUseCase: CreateCampaignUseCase;
  let mockCampaignRepository: Partial<jest.Mocked<CampaignRepository>>;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;


  beforeEach(async () => {
    mockCampaignRepository = {
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
        CreateCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: mockCampaignRepository,
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

    createCampaignUseCase = module.get<CreateCampaignUseCase>(
      CreateCampaignUseCase,
    );
  });

  it('should be defined', () => {
    expect(createCampaignUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when campaignRepository.create fails', async () => {
    mockCampaignRepository.create.mockRejectedValueOnce(
      new Error('Erro ao criar campanha'),
    );

    const mockCampaignDto: CreateCampaignDto = {
      tipo: 'Test',
      dias: ['Segunda-feira'],
      horario_inicial: '2023-09-18T09:00:00Z',
      horario_final: '2023-09-18T17:00:00Z',
      limite_corridas_ignoradas: 3,
      limite_corridas_recusadas: 2,
      tempo_de_tolerancia: '2023-09-18T09:15:00Z',
      descricao: 'Descrição Teste',
    };

    await expect(createCampaignUseCase.create(mockCampaignDto, {} as Express.Multer.File)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

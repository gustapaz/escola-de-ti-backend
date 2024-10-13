import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCampaignUseCase } from './update-campaign.use-case';
import { CampaignRepository } from '../repository/campaign.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { IMAGEN_UPDATE_PROVIDER } from '../../../shared/constants/injection-tokens';

describe('UpdateCampaignUseCase', () => {
  let updateCampaignUseCase: UpdateCampaignUseCase;
  let mockCampaignRepository: Partial<jest.Mocked<CampaignRepository>>;
  let mockCloudinaryUseCase: jest.Mocked<CloudinaryUseCase>;


  beforeEach(async () => {
    mockCampaignRepository = {
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
        UpdateCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: mockCampaignRepository,
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

    updateCampaignUseCase = module.get<UpdateCampaignUseCase>(
      UpdateCampaignUseCase,
    );
  });

  it('should be defined', () => {
    expect(updateCampaignUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when campaignRepository.update fails', async () => {
    const mockCampaignId = 'mockId';
    const mockUpdateDto: UpdateCampaignDto = {
      tipo: 'Test Atualizado',
      dias: ['Segunda-feira'],
      horario_inicial: '2023-09-18T09:00:00Z',
      horario_final: '2023-09-18T17:00:00Z',
      limite_corridas_ignoradas: 3,
      limite_corridas_recusadas: 2,
      tempo_de_tolerancia: '2023-09-18T09:15:00Z',
      descricao: 'Descrição Teste Atualizada',
    };

    mockCampaignRepository.update.mockRejectedValueOnce(
      new Error('Erro ao atualizar campanha'),
    );

    await expect(
      updateCampaignUseCase.update(mockCampaignId, mockUpdateDto, {} as Express.Multer.File),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

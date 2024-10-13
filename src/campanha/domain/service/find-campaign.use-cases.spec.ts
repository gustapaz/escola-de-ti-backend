import { Test, TestingModule } from '@nestjs/testing';
import { FindCampaignUseCase } from './find-campaign.use-cases';
import { CampaignRepository } from '../repository/campaign.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { IMAGEN_FIND_BY_ID_PROVIDER } from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';

describe('FindCampaignUseCase', () => {
  let findCampaignUseCase: FindCampaignUseCase;
  let mockCampaignRepository: Partial<jest.Mocked<CampaignRepository>>;

  beforeEach(async () => {
    mockCampaignRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const mockImageFindByIdProvider = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IFindById<Imagen>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: mockCampaignRepository,
        },
        {
          provide: IMAGEN_FIND_BY_ID_PROVIDER,
          useValue: mockImageFindByIdProvider,
        },
      ],
    }).compile();

    findCampaignUseCase = module.get<FindCampaignUseCase>(FindCampaignUseCase);
  });

  it('should be defined', () => {
    expect(findCampaignUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when campaignRepository.findAll fails', async () => {
    mockCampaignRepository.findAll.mockRejectedValueOnce(
      new Error('Erro ao buscar campanhas'),
    );

    await expect(findCampaignUseCase.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when campaignRepository.findOne fails', async () => {
    const mockCampaignId = 'mockId';
    const mockMotoboyId = 'mockMotoboyId';

    mockCampaignRepository.findOne.mockRejectedValueOnce(
      new Error('Erro ao buscar campanha por id'),
    );

    await expect(
      findCampaignUseCase.findOne(mockCampaignId, mockMotoboyId),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

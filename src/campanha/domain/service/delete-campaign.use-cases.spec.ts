import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCampaignUseCase } from './delete-campaign.use-cases';
import { CampaignRepository } from '../repository/campaign.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { IMAGEN_DELETE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IDelete } from '../../../shared/interfaces/delete.interface';

describe('DeleteCampaignUseCase', () => {
  let deleteCampaignUseCase: DeleteCampaignUseCase;
  let mockCampaignRepository: Partial<jest.Mocked<CampaignRepository>>;

  beforeEach(async () => {
    mockCampaignRepository = {
      delete: jest.fn(),
    };

    const mockImageDeleteProvider = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<IDelete<void>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCampaignUseCase,
        {
          provide: CampaignRepository,
          useValue: mockCampaignRepository,
        },
        {
          provide: IMAGEN_DELETE_PROVIDER,
          useValue: mockImageDeleteProvider,
        },
      ],
    }).compile();

    deleteCampaignUseCase = module.get<DeleteCampaignUseCase>(
      DeleteCampaignUseCase,
    );
  });

  it('should be defined', () => {
    expect(deleteCampaignUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when campaignRepository.delete fails', async () => {
    const mockCampaignId = 'mockId';

    mockCampaignRepository.delete.mockRejectedValueOnce(
      new Error('Erro ao deletar campanha'),
    );

    await expect(deleteCampaignUseCase.delete(mockCampaignId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});

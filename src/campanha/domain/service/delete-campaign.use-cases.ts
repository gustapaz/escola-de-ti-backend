import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { IMAGEN_DELETE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IDelete } from '../../../shared/interfaces/delete.interface';

@Injectable()
export class DeleteCampaignUseCase {
  constructor(
    @Inject(IMAGEN_DELETE_PROVIDER)
    private readonly image: IDelete<void>,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  async delete(id: string): Promise<void> {
    try {
      await this.image.delete(id);
      return await this.campaignRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar campanha', error);
    }
  }
}

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { IMAGEN_FIND_BY_ID_PROVIDER } from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';

@Injectable()
export class FindCampaignUseCase {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    @Inject(IMAGEN_FIND_BY_ID_PROVIDER)
    private readonly image: IFindById<Imagen>,
  ) {}

  async findAll() {
    try {
      const response = await this.campaignRepository.findAll();
      const campaigns = await Promise.all(
        response.map(async (campaign) => {
          const imagem = await this.image.findById(campaign.id);
          return { ...campaign, imagem };
        }),
      );
      return campaigns;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar campanhas', error);
    }
  }

  async findOne(id: string, motoboyId: string) {
    try {
      const response = await this.campaignRepository.findOne(id, motoboyId);
      const imagem = await this.image.findById(id);
      return { ...response, imagem };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar campanha por id',
      );
    }
  }
}

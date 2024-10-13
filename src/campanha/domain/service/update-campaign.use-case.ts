import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CampaignRepository } from '../repository/campaign.repository';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { IMAGEN_UPDATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';

@Injectable()
export class UpdateCampaignUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    private readonly campaignRepository: CampaignRepository,

    @Inject(IMAGEN_UPDATE_PROVIDER)
    private readonly image: IUpdate<UpdateImagenDto, Imagen>,
  ) {}

  async update(
    id: string,
    input: UpdateCampaignDto,
    image: Express.Multer.File,
  ) {
    try {
      const response = await this.campaignRepository.update(id, input);
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      const imagem = await this.image.update(id, { url: imageUrl });

      return { ...response, imagem: imageUrl };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar campanha',
        error,
      );
    }
  }
}

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Campaign } from '../entities/campaign.entity';
import { CampaignRepository } from '../repository/campaign.repository';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { IMAGEN_CREATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { ICreate } from '../../../shared/interfaces/create.interface';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    @Inject(IMAGEN_CREATE_PROVIDER)
    private readonly image: ICreate<CreateImagenDto, Imagen>,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  async create(
    input: CreateCampaignDto,
    image: Express.Multer.File,
  ) {
    try {
      const response = await this.campaignRepository.create(input);
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      await this.image.create({
        url: imageUrl,
        id_origem: response.id,
      });
      return { ...response, imageUrl };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar campanha', error);
    }
  }
}

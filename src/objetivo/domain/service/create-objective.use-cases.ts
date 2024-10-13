import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectiveRepository } from '../repository/objective.repository';
import { CreateObjectiveDto } from '../dto/create-objective.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { IMAGEN_CREATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { ICreate } from '../../../shared/interfaces/create.interface';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';

@Injectable()
export class CreateObjectiveUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    @Inject(IMAGEN_CREATE_PROVIDER)
    private readonly image: ICreate<CreateImagenDto, Imagen>,
    private readonly objectiveRepository: ObjectiveRepository,
  ) {}

  async create(input: CreateObjectiveDto, image: Express.Multer.File) {
    try {
      const response = await this.objectiveRepository.create(input);
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      await this.image.create({
        url: imageUrl,
        id_origem: response.id,
      });
      return { ...response, imageUrl };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar Objetivo', error);
    }
  }
}

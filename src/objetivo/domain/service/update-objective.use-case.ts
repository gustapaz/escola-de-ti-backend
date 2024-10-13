import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectiveRepository } from '../repository/objective.repository';
import { UpdateObjectiveDto } from '../dto/update-objective.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { IMAGEN_UPDATE_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';

@Injectable()
export class UpdateObjectiveUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    private readonly objectiveRepository: ObjectiveRepository,

    @Inject(IMAGEN_UPDATE_PROVIDER)
    private readonly image: IUpdate<UpdateImagenDto, Imagen>,
  ) {}

  async update(
    id: string,
    input: UpdateObjectiveDto,
    image: Express.Multer.File,
  ) {
    try {
      const response = await this.objectiveRepository.update(id, input);
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      const imagem = await this.image.update(id, { url: imageUrl });
      return { ...response, imageUrl };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar Objetivo',
        error,
      );
    }
  }
}

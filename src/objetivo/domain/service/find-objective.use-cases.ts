import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectiveRepository } from '../repository/objective.repository';
import { IMAGEN_FIND_BY_ID_PROVIDER } from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';

@Injectable()
export class FindObjectiveUseCase {
  constructor(
    private readonly objectiveRepository: ObjectiveRepository,
    @Inject(IMAGEN_FIND_BY_ID_PROVIDER)
    private readonly image: IFindById<Imagen>,
  ) {}

  async findAll() {
    try {
      const response = await this.objectiveRepository.findAll();
      const responseWithImage = await Promise.all(
        response.map(async (objective) => {
          const image = await this.image.findById(objective.id);
          return {
            ...objective,
            image,
          };
        }),
      );
      return responseWithImage;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar Objetivos', error);
    }
  }

  async findOne(id: string) {
    try {
      const response = await this.objectiveRepository.findOne(id);
      const imagem = await this.image.findById(id);
      return {
        ...response,
        imagem,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar Objetivo por id',
        error,
      );
    }
  }
}

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ObjectiveRepository } from '../repository/objective.repository';
import { IDelete } from '../../../shared/interfaces/delete.interface';
import { IMAGEN_DELETE_PROVIDER } from '../../../shared/constants/injection-tokens';

@Injectable()
export class DeleteObjectiveUseCase {
  constructor(
    @Inject(IMAGEN_DELETE_PROVIDER)
    private readonly image: IDelete<void>,
    private readonly objectiveRepository: ObjectiveRepository,
  ) {}

  async delete(id: string): Promise<void> {
    try {
      await this.image.delete(id);
      return await this.objectiveRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar Objetivo', error);
    }
  }
}

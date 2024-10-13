import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MetaRepository } from '../repository/meta.repository';

@Injectable()
export class DeleteMetaUseCase {
  constructor(private readonly metaRepository: MetaRepository) {}

  async delete(idObjetivo: string, idInscrito: string): Promise<void> {
    try {
      return await this.metaRepository.delete(idObjetivo, idInscrito);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar Meta', error);
    }
  }
}

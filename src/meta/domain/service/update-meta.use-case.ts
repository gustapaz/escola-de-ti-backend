import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Meta } from '../entities/meta.entity';
import { MetaRepository } from '../repository/meta.repository';
import { ObjectiveRepository } from '../../../objetivo/domain/repository/objective.repository';
import { UpdateMetaDto } from '../dto/update-meta.dto';

@Injectable()
export class UpdateMetaUseCase {
  constructor(
    private readonly metaRepository: MetaRepository,
    private readonly objectiveRepository: ObjectiveRepository,
  ) { }

  async update(
    idObjetivo: string,
    idInscrito: string,
    input: UpdateMetaDto,
  ): Promise<Meta> {
    const objetivo = await this.objectiveRepository.findOne(idObjetivo);
    if (!objetivo) {
      throw new NotFoundException('Objetivo não encontrado.');
    }
    try {
      const porcentagemProgresso = input.valor_atingido / objetivo.meta;
      const updatedInput = { ...input, valor_atingido: porcentagemProgresso };

      const response = await this.metaRepository.update(
        idObjetivo,
        idInscrito,
        updatedInput,
      );

      return response;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar Meta', error);
    }
  }
}

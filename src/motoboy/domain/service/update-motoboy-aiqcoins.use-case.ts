import { Motoboy } from '../entities/motoboy.entity';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
@Injectable()
export class UpdateMotoboyAiqcoinsUseCase implements IUpdate<any, Motoboy> {
  constructor(private readonly motoboyRepository: MotoboyRepository) {}

  async update(id: string, input: any): Promise<Motoboy> {
    const motoboy = await this.motoboyRepository.findById(id);
    if (!motoboy) {
      throw new NotFoundException('Entregador não encontrado');
    }
    try {
      const updateMotoboy = await this.motoboyRepository.updateAiqcoins(
        id,
        input,
      );

      return updateMotoboy;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar AiQCoins do entregador',
        error,
      );
    }
  }
}

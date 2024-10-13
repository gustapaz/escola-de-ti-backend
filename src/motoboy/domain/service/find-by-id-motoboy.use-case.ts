import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Motoboy } from '../entities/motoboy.entity';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';


@Injectable()
export class FindByIdMotoboyUseCase implements IFindById<Motoboy> {
  constructor(private readonly motoboyRepository: MotoboyRepository) {}

  async findById(id: string): Promise<Motoboy> {
    try {
      return await this.motoboyRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar Entregador pro Id',
        error,
      );
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Motoboy } from '../entities/motoboy.entity';
import { MotoboyRepository } from '../repository/motoboy.repository';

@Injectable()
export class FindAllMotoboyUseCase {
  constructor(private readonly motoboyRepository: MotoboyRepository) {}

  async findAll(): Promise<Motoboy[]> {
    try {
      return await this.motoboyRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar Entregadores',
        error,
      );
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Motoboy } from '../entities/motoboy.entity';
import { MotoboyRepository } from '../repository/motoboy.repository';

@Injectable()
export class FindByEmailMotoboyUseCase {
  constructor(private readonly motoboyRepository: MotoboyRepository) {}

   async findByEmail(email: string): Promise<Motoboy> {
    try {
      return await this.motoboyRepository.findByEmail(email);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar Entregador por Email',
        error,
      );
    }
  }
}

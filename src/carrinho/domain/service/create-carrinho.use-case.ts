import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Carrinho } from '../entities/carrinho.entity';
import { CarrinhoRepository } from '../repository/carrinho.repository';

@Injectable()
export class CreateCarrinhoUseCase {
  constructor(private carrinhoRepository: CarrinhoRepository) {}

  async create(id_motoboy: string): Promise<Carrinho> {
    try {
      return await this.carrinhoRepository.create(id_motoboy);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar carrinho', error);
    }
  }
}

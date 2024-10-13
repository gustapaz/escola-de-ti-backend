import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';

@Injectable()
export class DeleteCarrinhoUseCase {
  constructor(private readonly carrinhoRepository: CarrinhoRepository) {}

  async delete(id: string) {
    try {
    return await this.carrinhoRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar carrinho', error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ItemCarrinhoRepository } from '../repository/item-carrinho.repository';
import { IFindAllById } from 'src/shared/interfaces/find-all-by-id.interface';
import { ItemCarrinho } from '../entities/item-carrinho.entity';

@Injectable()
export class FindAllByIdItensCarrinhoUseCase implements IFindAllById<ItemCarrinho>{
  constructor(private itemCarrinhoRepository: ItemCarrinhoRepository) {}

  async findAllById(idCarrinho: string) {
    return await this.itemCarrinhoRepository.findAllById(idCarrinho);
  }
}

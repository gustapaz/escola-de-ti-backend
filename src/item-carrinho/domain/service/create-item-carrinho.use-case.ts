import { Injectable } from '@nestjs/common';
import { ItemCarrinho } from '../entities/item-carrinho.entity';
import { CreateItemCarrinhoDto } from '../dto/create-item-carrinho.dto';
import { ItemCarrinhoRepository } from '../repository/item-carrinho.repository';
import { ICreate } from 'src/shared/interfaces/create.interface';

@Injectable()
export class CreateItemCarrinhoUseCase
  implements ICreate<CreateItemCarrinhoDto, ItemCarrinho>
{
  constructor(private itemCarrinhoRepository: ItemCarrinhoRepository) {}

  async create(input: CreateItemCarrinhoDto): Promise<ItemCarrinho> {
    return await this.itemCarrinhoRepository.create(input);
  }
}

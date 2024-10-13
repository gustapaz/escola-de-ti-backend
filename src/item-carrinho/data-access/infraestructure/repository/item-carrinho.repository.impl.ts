import { ItemCarrinho } from '../../../domain/entities/item-carrinho.entity';
import { CreateItemCarrinhoDto } from '../../../domain/dto/create-item-carrinho.dto';
import { ItemCarrinhoRepository } from 'src/item-carrinho/domain/repository/item-carrinho.repository';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';

export class ItemCarrinhoRepositoryImpl implements ItemCarrinhoRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(input: CreateItemCarrinhoDto): Promise<ItemCarrinho> {
    const [itemCarrinho] = await this.knex('item_carrinho')
      .insert(input)
      .returning('*');
    return itemCarrinho;
  }
  
  async findAllById(idCarrinho: string): Promise<ItemCarrinho[]> {
      return await this.knex.from('item_carrinho')
        .select('*')
        .where({ id_carrinho: idCarrinho });
  }
}

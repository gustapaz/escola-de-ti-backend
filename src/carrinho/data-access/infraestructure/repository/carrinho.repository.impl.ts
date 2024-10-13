import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Carrinho } from 'src/carrinho/domain/entities/carrinho.entity';
import { CarrinhoRepository } from 'src/carrinho/domain/repository/carrinho.repository';
import { createdAt } from '../../../../shared/utils/created-at';
import { UpdateCarrinhoDto } from 'src/carrinho/domain/dto/update-carrinho.dto';
export class CarrinhoRepositoryImpl implements CarrinhoRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(id_motoboy: string): Promise<Carrinho> {
    const newCarrinho = {
      id_entregador: id_motoboy,
      valor: 0,
      data_de_compra: createdAt,
    };

    const [carrinho] = await this.knex
      .from('carrinho')
      .insert(newCarrinho)
      .returning('*');
    return carrinho;
  }
  async addCarrinho(id: string, input: UpdateCarrinhoDto): Promise<Carrinho> {
    const [carrinho] = await this.knex
      .from('carrinho')
      .update(input)
      .where({ id })
      .returning('*');
    return carrinho;
  }

  async findByIdMotoboy(id: string): Promise<Carrinho> {
    const [cart] = await this.knex
      .from('carrinho')
      .select('*')
      .where({ id_entregador: id, status: true });
    return cart;
  }
  async findById(id: string): Promise<Carrinho> {
    const [cart] = await this.knex.from('carrinho').select('*').where({ id });
    return cart;
  }
  async delete(id: string): Promise<void> {
    await this.knex.from('item_carrinho').where({ id_carrinho: id }).del();
  }

  async deleteItemCarrinho(id_itens: string): Promise<void> {
    await this.knex.from('item_carrinho').where({ id: id_itens }).del();
  }
}

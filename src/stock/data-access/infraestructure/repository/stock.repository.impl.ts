import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateStockDto } from '../../../domain/dto/create-stock.dto';
import { UpdateStockDto } from '../../../domain/dto/update-stock.dto';
import { Stock } from '../../../domain/entities/stock.entity';
import { StockRepository } from '../../../domain/repository/stock.repository';

export class StockRepositoryImpl implements StockRepository {
  constructor(@InjectKnex() private knex: Knex) {}

  async create(input: CreateStockDto): Promise<Stock> {
    const [stock] = await this.knex('estoque').insert(input).returning('*');
    return stock;
  }

  async findAll(): Promise<Stock[]> {
    return await this.knex('estoque').select('*');
  }

  async findById(id: string): Promise<Stock> {
    const [stock] = await this.knex('estoque')
      .select('*')
      .where({ id_produto: id });
    return stock;
  }

  async update(id: string, input: UpdateStockDto): Promise<Stock> {
    const [stock] = await this.knex('estoque')
      .update({
        quantidade: input.quantidade,
      })
      .where({ id_produto: id })
      .returning('*');
    return stock;
  }

  async delete(id: string): Promise<void> {
    await this.knex('estoque').where({ id_produto: id }).del();
  }
}

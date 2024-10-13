import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateProductDto } from 'src/products/domain/dto/create-product.dto';
import { UpdateProductDto } from 'src/products/domain/dto/update-product.dto';
import { Product } from '../../../domain/entities/product.entity';
import { ProductRepository } from 'src/products/domain/repository/products.repository';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(@InjectKnex() private knex: Knex) {}

  async create(input: CreateProductDto): Promise<Product> {
    const [product] = await this.knex.from('produto').insert(input).returning('*');
    return product;
  }
  async findAll(): Promise<Product[]> {
    return this.knex.from('produto').select('*');
  }
  async findById(id: string): Promise<Product> {
    const [product] = await this.knex.from('produto').select('*').where({ id });
    return product;
  }
  async update(id: string, input: UpdateProductDto): Promise<Product> {
    const [product] = await this.knex.from('produto')
      .update({
        nome: input.nome,
        descricao: input.descricao,
        valor: input.valor,
        status: input.status,
      })
      .where({ id })
      .returning('*');
    return product;
  }
  async delete(id: string): Promise<void> {
    await this.knex.from('produto').where({ id }).del();
  }
}

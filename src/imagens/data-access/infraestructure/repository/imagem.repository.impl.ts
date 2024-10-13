import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { ImagemRepository } from '../../../domain/repository/imagem.repository';
import { CreateImagenDto } from '../../../domain/dto/create-imagen.dto';
import { UpdateImagenDto } from '../../../domain/dto/update-imagen.dto';
import { Imagen } from '../../../domain/entities/imagen.entity';

export class ImagemRepositoryImpl implements ImagemRepository {
  constructor(@InjectKnex() private knex: Knex) {}

  async create(input: CreateImagenDto): Promise<Imagen> {
    const [imagen] = await this.knex('imagem').insert(input).returning('*');
    return imagen;
  }

  async findAll(): Promise<Imagen[]> {
    return await this.knex('imagem').select('*');
  }

  async findById(id: string): Promise<Imagen> {
    const [imagen] = await this.knex('imagem')
      .select('*')
      .where({ id_origem: id });
    return imagen;
  }

  async update(id: string, input: UpdateImagenDto): Promise<Imagen> {
    const [imagen] = await this.knex('imagem')
      .where({ id_origem: id })
      .update(input)
      .returning('*');
    return imagen;
  }

  async delete(id: string): Promise<void> {
    await this.knex('imagem').where({ id_origem: id }).del();
  }
}

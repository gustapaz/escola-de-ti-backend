import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateMetaDto } from 'src/meta/domain/dto/create-meta.dto';
import { UpdateMetaDto } from 'src/meta/domain/dto/update-meta.dto';
import { Meta } from 'src/meta/domain/entities/meta.entity';
import { MetaRepository } from 'src/meta/domain/repository/meta.repository';

export class MetaRepositoryImpl implements MetaRepository {
  constructor(@InjectKnex() private readonly knex: Knex) { }

  async create(input: CreateMetaDto): Promise<Meta> {
    const [meta] = await this.knex('meta_atingida')
      .insert(input)
      .returning('*');
    return meta;
  }

  async update(
    idObjetivo: string,
    idInscrito: string,
    input: UpdateMetaDto,
  ): Promise<Meta> {
    const [meta] = await this.knex('meta_atingida')
      .where({ id_objetivo: idObjetivo, id_inscrito: idInscrito })
      .update(input)
      .returning('*');
    return meta;
  }

  async delete(idObjetivo: string, idInscrito: string): Promise<void> {
    await this.knex('meta_atingida')
      .where({ id_objetivo: idObjetivo, id_inscrito: idInscrito })
      .del();
  }

  async findAll(): Promise<Meta[]> {
    const metas = await this.knex('meta_atingida').select('*');
    return metas;
  }

  async findOne(idObjetivo: string, idInscrito: string): Promise<Meta> {
    const [meta] = await this.knex('meta_atingida')
      .where({ id_objetivo: idObjetivo, id_inscrito: idInscrito })
      .select('*');
    return meta;
  }
}

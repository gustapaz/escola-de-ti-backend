import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Motoboy } from '../../../domain/entities/motoboy.entity';
import { CreateMotoboyDto } from '../../../domain/dto/create-motoboy.dto';
import { UpdateMotoboyRequestDto } from '../../../domain/dto/update-motoboy-request.dto';
import { MotoboyRepository } from '../../../domain/repository/motoboy.repository';
import {
  NotFoundException,
} from '@nestjs/common';
import { UpdateMotoboyResponseDto } from 'src/motoboy/domain/dto/update-motoboy-response.dto';

export class MotoboyRepositoryImpl implements MotoboyRepository {
  constructor(@InjectKnex() private knex: Knex) {}
  async create(input: CreateMotoboyDto): Promise<Motoboy> {
    const [motoboy] = await this.knex('entregador')
      .insert(input)
      .returning([
        'id',
        'nome',
        'sobrenome',
        'email',
        'telefone',
        'data_de_nascimento',
        'mochila',
      ]);
    return motoboy;
  }

  async findAll(): Promise<Motoboy[]> {
    const motoboys = await this.knex.from('entregador').select('*');
    return motoboys;
  }

  async findById(id: string): Promise<Motoboy> {
    const [motoboy] = await this.knex
      .from('entregador')
      .select('*')
      .where({ id: id });
    if (!motoboy) {
      throw new NotFoundException('Entregador não encontrado');
    }
    return motoboy;
  }

  async findByEmail(email: string): Promise<Motoboy> {
    const [motoboy] = await this.knex
      .from('entregador')
      .select('senha', 'email', 'status', 'id')
      .where({ email: email });
    if (!motoboy) {
      throw new NotFoundException('Entregador não encontrado');
    }
    return motoboy;
  }

  async profile(email: string): Promise<Motoboy> {
    const [motoboy] = await this.knex
      .from('entregador')
      .select('nome', 'aiqcoins')
      .where({ email: email });
    if (!motoboy) {
      throw new NotFoundException('Entregador não encontrado');
    }
    return motoboy;
  }

  async update(id: string, input: UpdateMotoboyRequestDto): Promise<Motoboy> {
    const existingMotoboy = await this.knex('entregador')
      .where({ id: id })
      .select('*');
    if (existingMotoboy.length === 0) {
      throw new NotFoundException('Entregador não encontrado para atualizar');
    }
    const [motoboy] = await this.knex('entregador')
      .where({ id: id })
      .update({
        nome: input.nome,
        sobrenome: input.sobrenome,
        email: input.email,
        telefone: input.telefone,
        data_de_nascimento: input.data_de_nascimento,
        mochila: input.mochila,
        cidade: input.cidade,
      })
      .returning([
        'nome',
        'sobrenome',
        'email',
        'telefone',
        'data_de_nascimento',
        'mochila',
        'cidade',
      ]);
    return motoboy;
  }

  async updateAiqcoins(
    id: string,
    input: UpdateMotoboyResponseDto,
  ): Promise<Motoboy> {
    const [motoboy] = await this.knex('entregador')
      .where({ id: id })
      .update({
        aiqcoins: input.aiqcoins,
      })
      .returning(['aiqcoins']);
    return motoboy;
  }

  async delete(id: string): Promise<void> {
    const existingMotoboy = await this.knex('entregador')
      .where({ id: id })
      .select('*');
    if (existingMotoboy.length === 0) {
      throw new NotFoundException('Entregador não encontrado para deletar');
    }
    await this.knex('inscrito').where({ id_entregador: id }).del();
    await this.knex('conta').where({ id_entregador: id }).del();
    await this.knex('entregador').where({ id: id }).del();
  }
}

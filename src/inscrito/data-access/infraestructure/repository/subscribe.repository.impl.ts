import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateSubscribeDto } from '../../../domain/dto/create-subscribe.dto';
import { UpdateSubscribeDto } from '../../../domain/dto/update-subscribe.dto';
import { Subscribe } from '../../../domain/entities/subscribe.entity';
import { SubscribeRepository } from '../../../domain/repository/subscribe.repository';

export class SubscribeRepositoryImpl implements SubscribeRepository {
  constructor(@InjectKnex() private readonly knex: Knex) { }

  async create(input: CreateSubscribeDto): Promise<Subscribe> {
    const [registered] = await this.knex('inscrito')
      .insert(input)
      .returning('*');
    return registered;
  }

  async update(id: string, input: UpdateSubscribeDto): Promise<Subscribe> {
    const [updatedSubscribe] = await this.knex('inscrito')
      .where({ id })
      .update(input)
      .returning('*');
    return updatedSubscribe;
  }

  async delete(id: string): Promise<void> {
    await this.knex('inscrito').where({ id }).del();
  }

  async findAll(): Promise<Subscribe[]> {
    const subscribes = await this.knex('inscrito').select('*');
    return subscribes;
  }

  async findOne(id: string): Promise<Subscribe> {
    const [subscribe] = await this.knex('inscrito')
      .where({ id })
      .select('*');
    if (!subscribe) throw new NotFoundException('Inscrito não encontrado');
    return subscribe;
  }
}

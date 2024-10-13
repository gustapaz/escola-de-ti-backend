import {
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { CreateObjectiveDto } from '../../../domain/dto/create-objective.dto';
import { UpdateObjectiveDto } from '../../../domain/dto/update-objective.dto';
import { Objective } from '../../../domain/entities/objetivo.entity';
import { ObjectiveRepository } from '../../../domain/repository/objective.repository';

export class ObjectiveRepositoryImpl implements ObjectiveRepository {
  constructor(@InjectKnex() private readonly knex: Knex) { }

  async create(createObjectiveDto: CreateObjectiveDto): Promise<Objective> {
    const [objective] = await this.knex('objetivo')
      .insert(createObjectiveDto)
      .returning('*');
    return objective;
  }

  async update(id: string, input: UpdateObjectiveDto): Promise<Objective> {
    const [updatedObjective] = await this.knex('objetivo')
      .where({ id })
      .update(input)
      .returning('*');
    return updatedObjective;
  }

  async delete(id: string): Promise<void> {
    await this.knex('meta_atingida').where({ id_objetivo: id }).del();
    await this.knex('objetivo').where({ id }).del();
  }

  async findAll(): Promise<Objective[]> {
    const objectives = await this.knex('objetivo').select('*');
    return objectives;
  }

  async findOne(id: string): Promise<Objective> {
    const [objective] = await this.knex('objetivo').where({ id }).select('*');
    if (!objective) throw new NotFoundException('Objetivo não encontrado');
    const campaigns = await this.knex('campanha')
      .where({ id: objective.id_campanha })
      .select('*');
    objective.campanha = campaigns;
    return objective;
  }
}

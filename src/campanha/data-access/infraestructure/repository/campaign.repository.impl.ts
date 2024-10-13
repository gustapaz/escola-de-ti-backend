import {
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { InjectKnex } from 'nestjs-knex';
import { Campaign } from '../../../domain/entities/campaign.entity';
import { CampaignRepository } from '../../../domain/repository/campaign.repository';
import { CreateCampaignDto } from '../../../domain/dto/create-campaign.dto';
import { UpdateCampaignDto } from '../../../domain/dto/update-campaign.dto';

export class CampaignRepositoryImpl implements CampaignRepository {
  constructor(@InjectKnex() private readonly knex: Knex) { }

  async create(input: CreateCampaignDto): Promise<Campaign> {
    const [campaign] = await this.knex('campanha')
      .insert(input)
      .returning('*');
    return campaign;
  }

  async update(
    id: string,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const [updatedCampaign] = await this.knex('campanha')
      .where({ id })
      .update(updateCampaignDto)
      .returning('*');
    return updatedCampaign;
  }

  async delete(id: string): Promise<void> {
    await this.knex('inscrito').where({ id_campanha: id }).del();
    await this.knex('objetivo').where({ id_campanha: id }).del();
    await this.knex('campanha').where({ id }).del();
  }

  async findAll(): Promise<Campaign[]> {
    const campaigns = await this.knex('campanha').select('*');
    return campaigns;
  }

  async findOne(id: string, motoboyId: string): Promise<Campaign> {
    const [campaign] = await this.knex('campanha').where({ id }).select('*');
    if (!campaign) throw new NotFoundException('Campanha não encontrada');
    const objectives = await this.knex('objetivo')
      .where({ id_campanha: id })
      .select('*');
      for (const objetivo of objectives) {
        const [image] = await this.knex('imagem').where({ id_origem: objetivo.id}).select('url');
        const url = image.url 
        objetivo.imagem = url;
      }
    campaign.objetivos = objectives;
    const isRegistered = await this.knex('inscrito')
      .where({ id_entregador: motoboyId, id_campanha: id })
      .first();
    campaign.isRegistered = !!isRegistered;
    return campaign;
  }
}

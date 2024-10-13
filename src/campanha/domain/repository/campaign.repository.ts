import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { Campaign } from '../entities/campaign.entity';

export abstract class CampaignRepository {
  abstract create(input: CreateCampaignDto): Promise<Campaign>;

  abstract update(id: string, input: UpdateCampaignDto): Promise<Campaign>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<Campaign[]>;

  abstract findOne(id: string, motoboyId: string): Promise<Campaign>;
}

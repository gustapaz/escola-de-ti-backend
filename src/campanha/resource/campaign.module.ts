import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignRepository } from '../domain/repository/campaign.repository';
import { CampaignRepositoryImpl } from '../data-access/infraestructure/repository/campaign.repository.impl';
import { CreateCampaignUseCase } from '../domain/service/create-campaign.use-cases';
import { UpdateCampaignUseCase } from '../domain/service/update-campaign.use-case';
import { DeleteCampaignUseCase } from '../domain/service/delete-campaign.use-cases';
import { FindCampaignUseCase } from '../domain/service/find-campaign.use-cases';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth/resource/auth.module';
import { CloudinaryModule } from '../../cloudinary/resource/cloudinary.module';
import { ImagensModule } from '../../imagens/resource/imagens.module';

@Module({
  imports: [ConfigModule, AuthModule, CloudinaryModule, ImagensModule],
  controllers: [CampaignController],
  providers: [
    {
      provide: CampaignRepository,
      useClass: CampaignRepositoryImpl,
    },
    CreateCampaignUseCase,
    UpdateCampaignUseCase,
    DeleteCampaignUseCase,
    FindCampaignUseCase,
  ],
})
export class CampaignModule {}

import { Module } from '@nestjs/common';
import { ObjectiveRepositoryImpl } from '../data-access/infraestructure/repository/objective.repository.impl';
import { CreateObjectiveUseCase } from '../domain/service/create-objective.use-cases';
import { UpdateObjectiveUseCase } from '../domain/service/update-objective.use-case';
import { DeleteObjectiveUseCase } from '../domain/service/delete-objective.use-cases';
import { FindObjectiveUseCase } from '../domain/service/find-objective.use-cases';
import { ObjectiveController } from './objective.controller';
import { ObjectiveRepository } from '../domain/repository/objective.repository';
import { AuthModule } from '../../auth/resource/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../../cloudinary/resource/cloudinary.module';
import { ImagensModule } from '../../imagens/resource/imagens.module';

@Module({
  imports: [ConfigModule, AuthModule, CloudinaryModule, ImagensModule],
  controllers: [ObjectiveController],
  providers: [
    {
      provide: ObjectiveRepository,
      useClass: ObjectiveRepositoryImpl,
    },
    CreateObjectiveUseCase,
    UpdateObjectiveUseCase,
    DeleteObjectiveUseCase,
    FindObjectiveUseCase,
  ],
  exports: [ObjectiveRepository],
})
export class ObjectiveModule {}

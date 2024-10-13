import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { MetaRepository } from '../domain/repository/meta.repository';
import { MetaRepositoryImpl } from '../data-access/infraestructure/repository/meta.repository.impl';

import { CreateMetaUseCase } from '../domain/service/create-meta.use-cases';
import { UpdateMetaUseCase } from '../domain/service/update-meta.use-case';
import { DeleteMetaUseCase } from '../domain/service/delete-meta.use-cases';
import { FindMetaUseCase } from '../domain/service/find-meta.use-cases';
import { ObjectiveModule } from '../../objetivo/resource/objective.module';

@Module({
  imports: [ObjectiveModule],
  controllers: [MetaController],
  providers: [
    CreateMetaUseCase,
    UpdateMetaUseCase,
    DeleteMetaUseCase,
    FindMetaUseCase,
    {
      provide: MetaRepository,
      useClass: MetaRepositoryImpl,
    },
  ],
})
export class MetaModule {}

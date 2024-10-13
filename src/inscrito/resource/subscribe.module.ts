import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { CreateSubscribeUseCase } from '../domain/service/create-subscribe.use-cases';
import { UpdateSubscribeUseCase } from '../domain/service/update-subscribe.use-cases';
import { DeleteSubscribeUseCase } from '../domain/service/delete-subscribe.use-cases';
import { FindSubscribeUseCase } from '../domain/service/find-subscribe.use-cases';
import { SubscribeRepository } from '../domain/repository/subscribe.repository';
import { SubscribeRepositoryImpl } from '../data-access/infraestructure/repository/subscribe.repository.impl';

@Module({
  controllers: [SubscribeController],
  providers: [
    CreateSubscribeUseCase,
    UpdateSubscribeUseCase,
    DeleteSubscribeUseCase,
    FindSubscribeUseCase,
    {
      provide: SubscribeRepository,
      useClass: SubscribeRepositoryImpl,
    },
  ],
})
export class SubscribeModule {}

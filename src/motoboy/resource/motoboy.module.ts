import { Module, forwardRef } from '@nestjs/common';
import { MotoboyController } from './motoboy.controller';
import { CreateMotoboyUseCase } from '../domain/service/create-motoboy.use-case';
import { FindAllMotoboyUseCase } from '../domain/service/find-all-motoboy.use-case';
import { FindByIdMotoboyUseCase } from '../domain/service/find-by-id-motoboy.use-case';
import { FindByEmailMotoboyUseCase } from '../domain/service/find-by-email-motoboy.use-case';
import { UpdateMotoboyUseCase } from '../domain/service/update-motoboy.use-case';
import { DeleteMotoboyUseCase } from '../domain/service/delete-motoboy.use-case';
import { MotoboyRepositoryImpl } from '../data-access/infraestructure/repostitory/motoboy.repository.impl';
import { MotoboyRepository } from '../domain/repository/motoboy.repository';
import {
  MOTOBOY_UPDATE_PROVIDER,
  MOTOBOY_FIND_BY_ID_PROVIDER,
} from '../../shared/constants/injection-tokens';
import { UpdateMotoboyAiqcoinsUseCase } from '../domain/service/update-motoboy-aiqcoins.use-case';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth/resource/auth.module';

@Module({
  imports: [ConfigModule, forwardRef(() => AuthModule)],
  controllers: [MotoboyController],
  providers: [
    CreateMotoboyUseCase,
    FindAllMotoboyUseCase,
    FindByIdMotoboyUseCase,
    FindByEmailMotoboyUseCase,
    UpdateMotoboyUseCase,
    UpdateMotoboyAiqcoinsUseCase,
    DeleteMotoboyUseCase,
    {
      provide: MotoboyRepository,
      useClass: MotoboyRepositoryImpl,
    },
    {
      provide: MOTOBOY_UPDATE_PROVIDER,
      useClass: UpdateMotoboyAiqcoinsUseCase,
    },
    {
      provide: MOTOBOY_FIND_BY_ID_PROVIDER,
      useClass: FindByIdMotoboyUseCase,
    },
  ],
  exports: [
    MotoboyRepository,
    UpdateMotoboyUseCase,
    MOTOBOY_UPDATE_PROVIDER,
    MOTOBOY_FIND_BY_ID_PROVIDER,
    FindByIdMotoboyUseCase,
    UpdateMotoboyAiqcoinsUseCase
  ],
})
export class MotoboyModule {}

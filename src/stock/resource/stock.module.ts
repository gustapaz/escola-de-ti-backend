import { Module } from '@nestjs/common';
import { CreateStockUseCase } from '../domain/service/create-stock.use-case';
import { FindAllStockUseCase } from '../domain/service/find-all-stock.use-case';
import { FindByIdStockUseCase } from '../domain/service/find-by-id-stock.use-case';
import { UpdateStockUseCase } from '../domain/service/update-stock.use-case';
import { DeleteStockUseCase } from '../domain/service/delete-stock.use-case';
import { StockRepository } from '../domain/repository/stock.repository';
import { StockRepositoryImpl } from '../data-access/infraestructure/repository/stock.repository.impl';
import {
  STOCK_CREATE_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
  STOCK_DELETE_PROVIDER,
  STOCK_UPDATE_PROVIDER,
} from '../../shared/constants/injection-tokens';

@Module({
  providers: [
    CreateStockUseCase,
    FindAllStockUseCase,
    FindByIdStockUseCase,
    UpdateStockUseCase,
    DeleteStockUseCase,
    {
      provide: StockRepository,
      useClass: StockRepositoryImpl,
    },
    {
      provide: STOCK_CREATE_PROVIDER,
      useClass: CreateStockUseCase,
    },
    {
      provide: STOCK_FIND_BY_ID_PROVIDER,
      useClass: FindByIdStockUseCase,
    },
    {
      provide: STOCK_DELETE_PROVIDER,
      useClass: DeleteStockUseCase,
    },
    {
      provide: STOCK_UPDATE_PROVIDER,
      useClass: UpdateStockUseCase,
    },
  ],
  exports: [
    CreateStockUseCase,
    FindByIdStockUseCase,
    DeleteStockUseCase,
    STOCK_CREATE_PROVIDER,
    STOCK_FIND_BY_ID_PROVIDER,
    STOCK_DELETE_PROVIDER,
    STOCK_UPDATE_PROVIDER,
  ],
})
export class StockModule {}

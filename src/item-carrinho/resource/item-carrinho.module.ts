import { Module } from '@nestjs/common';
import { CreateItemCarrinhoUseCase } from '../domain/service/create-item-carrinho.use-case';
import { FindAllByIdItensCarrinhoUseCase } from '../domain/service/find-all-by-id-itens-carrinho.use-case';
import { ItemCarrinhoRepository } from '../domain/repository/item-carrinho.repository';
import { ItemCarrinhoRepositoryImpl } from '../data-access/infraestructure/repository/item-carrinho.repository.impl';
import {
  ITEM_CARRINHO_CREATE_PROVIDER,
  ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
} from '../../shared/constants/injection-tokens';

@Module({
  controllers: [],
  providers: [
    CreateItemCarrinhoUseCase,
    FindAllByIdItensCarrinhoUseCase,
    {
      provide: ItemCarrinhoRepository,
      useClass: ItemCarrinhoRepositoryImpl,
    },
    {
      provide: ITEM_CARRINHO_CREATE_PROVIDER,
      useClass: CreateItemCarrinhoUseCase,
    },
    {
      provide: ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
      useClass: FindAllByIdItensCarrinhoUseCase,
    },
  ],
  exports: [
    CreateItemCarrinhoUseCase,
    ITEM_CARRINHO_CREATE_PROVIDER,
    FindAllByIdItensCarrinhoUseCase,
    ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
  ],
})
export class ItemCarrinhoModule {}

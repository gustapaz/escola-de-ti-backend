import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import { Motoboy } from '../../../motoboy/domain/entities/motoboy.entity';
import { UpdateStockDto } from '../../../stock/domain/dto/update-stock.dto';
import {
  CARRINHO_FIND_ITENS_BY_ID_PROVIDER,
  STOCK_UPDATE_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
  MOTOBOY_UPDATE_PROVIDER,
  MOTOBOY_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';

@Injectable()
export class FinishCompraCarrinhoUseCase {
  constructor(
    private readonly carrinhoRepository: CarrinhoRepository,
    @Inject(CARRINHO_FIND_ITENS_BY_ID_PROVIDER)
    private readonly findItensById: IFindById<FindItensCarrinhoResponseDto>,
    @Inject(STOCK_UPDATE_PROVIDER)
    private readonly updateStock: IUpdate<UpdateStockDto, Stock>,
    @Inject(STOCK_FIND_BY_ID_PROVIDER)
    private readonly findByIdStock: IFindById<Stock>,
    @Inject(MOTOBOY_UPDATE_PROVIDER)
    private readonly updateMotoboy: IUpdate<any, Motoboy>,
    @Inject(MOTOBOY_FIND_BY_ID_PROVIDER)
    private readonly findByIdMotoboy: IFindById<Motoboy>,
  ) {}

  async finishCompra(id: string) {
    const carrinho = await this.carrinhoRepository.findById(id);
    const itensCarrinho = await this.findItensById.findById(
      carrinho.id_entregador,
    );

    for (const item of itensCarrinho.itens) {
      const currentStockItem = await this.findByIdStock.findById(
        item.id_produto,
      );
      const newStockQuantity = currentStockItem.quantidade - item.quantidade;
      if (newStockQuantity < 0) {
        throw new BadRequestException(
          'Quantidade insuficiente em estoque para o produto ' +
            item.id_produto,
        );
      }
      await this.updateStock.update(item.id_produto, {
        quantidade: newStockQuantity,
      });
    }

    const motoboy = await this.findByIdMotoboy.findById(carrinho.id_entregador);
    if (!motoboy) {
      throw new BadRequestException('Entregador não foi encontrado');
    }
    const newAiqCoins = motoboy.aiqcoins - carrinho.valor_total;
    if (newAiqCoins < 0) {
      throw new BadRequestException(
        'Saldo insuficiente de AiqCoins para o entregador ' +
          carrinho.id_entregador,
      );
    }

      await this.updateMotoboy.update(carrinho.id_entregador, {
        aiqcoins: newAiqCoins,
      });

      const itens = itensCarrinho.itens.map((item) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        valor: item.valor,
      }));

      const compra = {
        id_carrinho: carrinho.id,
        id_entregador: carrinho.id_entregador,
        valor_total: carrinho.valor_total,
        itens,
      };

      return compra;
  
  }
}

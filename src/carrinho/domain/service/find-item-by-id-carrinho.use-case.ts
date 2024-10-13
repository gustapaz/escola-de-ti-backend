import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { IFindAllById } from '../../../shared/interfaces/find-all-by-id.interface';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import {
  ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER,
  PRODUCTS_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { ItemCarrinho } from '../../../item-carrinho/domain/entities/item-carrinho.entity';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';
@Injectable()
export class FindItensCarrinhoUseCase
  implements IFindById<FindItensCarrinhoResponseDto>
{
  constructor(
    private readonly carrinhoRepository: CarrinhoRepository,
    @Inject(ITEM_CARRINHO_FIND_ALL_BY_ID_PROVIDER)
    private readonly findAllById: IFindAllById<ItemCarrinho>,
    @Inject(PRODUCTS_FIND_BY_ID_PROVIDER)
    private readonly products: IFindById<any>,
  ) {}

  async findById(id_motoboy: string): Promise<FindItensCarrinhoResponseDto> {
    try {
      const carrinho = await this.carrinhoRepository.findByIdMotoboy(
        id_motoboy,
      );
      const itensCarrinho = await this.findAllById.findAllById(carrinho.id);
      const itens = [];

      for (const element of itensCarrinho) {
        const product = await this.products.findById(element.id_produto);
        itens.push({
          id: element.id,
          id_produto: element.id_produto,
          nome: product.nome,
          quantidade: element.quantidade,
          valor: element.valor,
          url: product.imagem.url,
        });
      }
      return { id: carrinho.id, valor_total: carrinho.valor_total, itens };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar itens', error);
    }
  }
}

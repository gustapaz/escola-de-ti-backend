import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CarrinhoRepository } from '../repository/carrinho.repository';
import { CARRINHO_FIND_ITENS_BY_ID_PROVIDER } from '../../../shared/constants/injection-tokens';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { FindItensCarrinhoResponseDto } from '../dto/find-itens-carrinho-response.dto';

@Injectable()
export class DeleteItemCarrinhoUseCase {
  constructor(
    private readonly carrinhoRepository: CarrinhoRepository,
    @Inject(CARRINHO_FIND_ITENS_BY_ID_PROVIDER)
    private readonly findItensById: IFindById<FindItensCarrinhoResponseDto>,
  ) {}

  async deleteItensCarrinho(id_itens: string, id_motoboy: string) {
    try {
      const itensCarrinho = await this.findItensById.findById(id_motoboy);

      const [itens] = itensCarrinho.itens.filter(
        (item) => item.id === id_itens,
      );

      const itemValor = itens.valor;
      const valorTotal = itensCarrinho.valor_total - itemValor;

      await this.carrinhoRepository.addCarrinho(itensCarrinho.id, {
        valor_total: valorTotal,
      });

      return await this.carrinhoRepository.deleteItemCarrinho(id_itens);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao deletar item do carrinho',
        error,
      );
    }
  }
}

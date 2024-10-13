import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductRepository } from '../repository/products.repository';
import { IDelete } from '../../../shared/interfaces/delete.interface';
import {
  IMAGEN_DELETE_PROVIDER,
  STOCK_DELETE_PROVIDER,
} from '../../../shared/constants/injection-tokens';

@Injectable()
export class DeleteProductsUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(IMAGEN_DELETE_PROVIDER)
    private readonly image: IDelete<void>,
    @Inject(STOCK_DELETE_PROVIDER)
    private readonly stock: IDelete<void>,
  ) {}

  async delete(id: string) {
    try {
      await this.image.delete(id);
      await this.stock.delete(id);
      return await this.productRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar produto', error);
    }
  }
}

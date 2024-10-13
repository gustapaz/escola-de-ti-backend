import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from '../repository/products.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import {
  IMAGEN_FIND_BY_ID_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class FindByIdProductsUseCase implements IFindById<Product> {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(IMAGEN_FIND_BY_ID_PROVIDER)
    private readonly image: IFindById<Imagen>,
    @Inject(STOCK_FIND_BY_ID_PROVIDER)
    private readonly stock: IFindById<Stock>,
  ) {}

  async findById(id: string) {
    try {
      const product = await this.productRepository.findById(id);
      const imagem = await this.image.findById(id);
      const stock = await this.stock.findById(id);
      return {
        ...product,
        imagem,
        stock,
      };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar produto', error);
    }
  }
}

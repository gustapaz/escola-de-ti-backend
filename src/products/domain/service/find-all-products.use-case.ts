import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from '../repository/products.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import {
  IMAGEN_FIND_BY_ID_PROVIDER,
  STOCK_FIND_BY_ID_PROVIDER,
} from '../../../shared/constants/injection-tokens';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { Stock } from '../../../stock/domain/entities/stock.entity';
@Injectable()
export class FindAllProductsUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(IMAGEN_FIND_BY_ID_PROVIDER)
    private readonly image: IFindById<Imagen>,
    @Inject(STOCK_FIND_BY_ID_PROVIDER)
    private readonly stock: IFindById<Stock>,
  ) {}
  async findAll() {
    try {
      const products = await this.productRepository.findAll();
      const productsWithImagens = await Promise.all(
        products.map(async (product) => {
          const imagem = await this.image.findById(product.id);
          const stock = await this.stock.findById(product.id);
          return {
            ...product,
            imagem,
            stock,
          };
        }),
      );
      return productsWithImagens;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar produtos', error);
    }
  }
}

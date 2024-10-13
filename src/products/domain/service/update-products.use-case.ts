import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { ProductRepository } from '../repository/products.repository';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { UpdateImagenDto } from '../../../imagens/domain/dto/update-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { UpdateStockDto } from '../../../stock/domain/dto/update-stock.dto';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import {
  IMAGEN_UPDATE_PROVIDER,
  STOCK_UPDATE_PROVIDER,
} from '../../../shared/constants/injection-tokens';

@Injectable()
export class UpdateProductsUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    private readonly productRepository: ProductRepository,

    @Inject(IMAGEN_UPDATE_PROVIDER)
    private readonly image: IUpdate<UpdateImagenDto, Imagen>,
    @Inject(STOCK_UPDATE_PROVIDER)
    private readonly stock: IUpdate<UpdateStockDto, Stock>,
  ) {}
  async update(
    id: string,
    input: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    try {
      const product = await this.productRepository.update(id, {
        nome: input.nome,
        descricao: input.descricao,
        valor: input.valor,
      });
      const stock = await this.stock.update(id, {
        quantidade: input.quantidade,
      });
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      await this.image.update(id, { url: imageUrl });
      return { ...product, imagem: imageUrl, estoque: stock };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar produto',
        error,
      );
    }
  }
}

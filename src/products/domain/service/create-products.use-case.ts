import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { CloudinaryUseCase } from '../../../cloudinary/domain/service/cloudinary.use-case';
import { ProductRepository } from '../repository/products.repository';
import { ICreate } from '../../../shared/interfaces/create.interface';
import { CreateImagenDto } from '../../../imagens/domain/dto/create-imagen.dto';
import { Imagen } from '../../../imagens/domain/entities/imagen.entity';
import { CreateStockDto } from '../../../stock/domain/dto/create-stock.dto';
import { Stock } from '../../../stock/domain/entities/stock.entity';
import {
  IMAGEN_CREATE_PROVIDER,
  STOCK_CREATE_PROVIDER,
} from '../../../shared/constants/injection-tokens';

@Injectable()
export class CreateProductsUseCase {
  constructor(
    private readonly cloudinaryUseCase: CloudinaryUseCase,
    @Inject(IMAGEN_CREATE_PROVIDER)
    private readonly image: ICreate<CreateImagenDto, Imagen>,
    @Inject(STOCK_CREATE_PROVIDER)
    private readonly stock: ICreate<CreateStockDto, Stock>,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(input: CreateProductDto, image: Express.Multer.File) {
    try {
      const product = await this.productRepository.create({
        nome: input.nome,
        descricao: input.descricao,
        valor: input.valor,
      });

      const stock = await this.stock.create({
        quantidade: input.quantidade,
        id_produto: product.id,
      });
      const imageUrl = await this.cloudinaryUseCase.uploadImage(image);
      await this.image.create({
        url: imageUrl,
        id_origem: product.id,
      });
      return { ...product, imageUrl, stock };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar produto', error);
    }
  }
}

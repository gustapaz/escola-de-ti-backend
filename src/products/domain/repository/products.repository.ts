import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(input: CreateProductDto): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: string): Promise<Product>;
  abstract update(id: string, input: UpdateProductDto): Promise<Product>;
  abstract delete(id: string): Promise<void>;
}

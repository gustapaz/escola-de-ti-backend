import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { Stock } from '../entities/stock.entity';

export abstract class StockRepository {
  abstract create(input: CreateStockDto): Promise<Stock>;
  abstract findAll(): Promise<Stock[]>;
  abstract findById(id: string): Promise<Stock>;
  abstract update(id: string, input: UpdateStockDto): Promise<Stock>;
  abstract delete(id: string): Promise<void>;
}

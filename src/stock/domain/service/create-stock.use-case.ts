import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStockDto } from '../dto/create-stock.dto';
import { Stock } from '../entities/stock.entity';
import { StockRepository } from '../repository/stock.repository';
import { ICreate } from '../../../shared/interfaces/create.interface';

@Injectable()
export class CreateStockUseCase implements ICreate<CreateStockDto, Stock> {
  constructor(private readonly stockRepository: StockRepository) {}

  async create(input: CreateStockDto) {
    try {
      return await this.stockRepository.create(input);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar estoque', error)
    }

  }
}
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Stock } from '../entities/stock.entity';
import { StockRepository } from '../repository/stock.repository';

@Injectable()
export class FindAllStockUseCase {
  constructor(private readonly stockRepository: StockRepository) {}

  async findAll(): Promise<Stock[]> {
    try {
      return await this.stockRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar todos estoques', error);
    }
  }
}

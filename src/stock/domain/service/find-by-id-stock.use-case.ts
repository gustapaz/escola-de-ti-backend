import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Stock } from '../entities/stock.entity';
import { StockRepository } from '../repository/stock.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';

@Injectable()
export class FindByIdStockUseCase implements IFindById<Stock>{
  constructor(private readonly stockRepository: StockRepository) {}

  async findById(id: string) {
    try {
      return await this.stockRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar estoque', error);
    }
    
  }
}

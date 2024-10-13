import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { Stock } from '../entities/stock.entity';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockRepository } from '../repository/stock.repository';

@Injectable()
export class UpdateStockUseCase implements IUpdate<UpdateStockDto, Stock> {
  constructor(private readonly stockRepository: StockRepository) {}

  async update(id: string, input: UpdateStockDto): Promise<Stock> {
    try {
      return await this.stockRepository.update(id, input);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar estoque',
        error,
      );
    }
  }
}

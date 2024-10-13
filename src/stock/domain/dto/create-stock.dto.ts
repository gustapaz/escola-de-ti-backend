import { IsNumber, IsString } from 'class-validator';

export class CreateStockDto {
  @IsString()
  id_produto: string;

  @IsNumber()
  quantidade: number;
}

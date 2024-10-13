import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCarrinhoDto {
  @ApiProperty({ example: 3, description: 'Quantidade do produto no carrinho' })
  @IsNumber()
  quantidade: number;
}

import { IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarrinhoDto {
  @ApiProperty({ example: 150.00, description: 'Valor total atualizado do carrinho', required: false })
  @IsNumber()
  valor_total?: number;

  @ApiProperty({ example: true, description: 'Status do carrinho (ex: concluído, pendente, etc.)', required: false })
  @IsBoolean()
  status?: boolean;
}

import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindItensCarrinhoResponseDto {
    @ApiProperty({ example: '123', description: 'ID do item no carrinho' })
    @IsString()
    id: string;

    @ApiProperty({ example: 100.50, description: 'Valor total dos itens no carrinho' })
    @IsNumber()
    valor_total: number;

    @ApiProperty({ example: [{  }], description: 'Lista de itens no carrinho' })
    itens: any[]; 
}

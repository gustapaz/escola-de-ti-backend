import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ description: 'Valor do produto' })
  @IsNumber()
  @IsPositive()
  valor: number;

  @ApiProperty({ description: 'Quantidade disponível', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantidade?: number;
}
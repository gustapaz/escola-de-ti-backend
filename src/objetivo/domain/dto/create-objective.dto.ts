import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Length,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateObjectiveDto {
  @ApiProperty({
    description: 'Id identificador da campanha',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_campanha: string;

  @ApiProperty({
    description: 'Título do objetivo',
    example: 'Objetivo Março',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 30)
  titulo: string;

  @ApiProperty({
    description: 'Descrição sobre o objetivo',
    example: 'Objetivo para o mês de Março',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(0, 200)
  descricao: string;

  @ApiProperty({
    description: 'Prêmio associado ao cumprimento do objetivo',
    example: 100,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  premio_associado: number;

  @ApiProperty({
    description: 'Meta associada ao objetivo',
    example: 500.5,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  meta: number;
}

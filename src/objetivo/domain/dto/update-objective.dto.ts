import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Length,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { CreateObjectiveDto } from './create-objective.dto';

export class UpdateObjectiveDto extends CreateObjectiveDto {
  @ApiProperty({
    description: 'Id identificador do objetivo',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id?: string;

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
  @IsOptional()
  @Length(0, 30)
  titulo: string;

  @ApiProperty({
    description: 'Descrição sobre o objetivo',
    example: 'Objetivo para o mês de Março',
    type: String,
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  descricao: string;

  @ApiProperty({
    description: 'Prêmio associado ao cumprimento do objetivo',
    example: 100,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  premio_associado: number;

  @ApiProperty({
    description: 'Meta associada ao objetivo',
    example: 500.5,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  meta: number;
}

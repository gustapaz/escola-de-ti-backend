import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsISO8601,
  IsInt,
  Length,
  Max,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Nome identificador da campanha',
    example: 'Campanha Massas Março',
    type: String,
  })
  @IsString({ message: 'O tipo deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo não pode estar vazio.' })
  @Length(1, 30, { message: 'O tipo deve ter entre 1 e 30 caracteres.' })
  tipo: string;

  @ApiProperty({
    description: 'Lista de dias em que a campanha será ativa',
    example: ['Segunda-feira', 'Terça-feira', 'Quarta-feira'],
    type: String,
  })
  @IsArray({ message: 'Os dias devem ser um array.' })
  @ArrayNotEmpty({ message: 'O array de dias não pode estar vazio.' })
  @ArrayUnique({ message: 'Os dias devem ser únicos.' })
  dias: Array<string>;

  @ApiProperty({
    description: 'Horário inicial em que a campanha começa todos os dias',
    example: '2023-09-18T09:00:00.000Z',
    type: String,
  })
  @IsString({ message: 'O horário inicial deve ser uma string.' })
  @IsISO8601()
  horario_inicial: string;

  @ApiProperty({
    description: 'Horário final em que a campanha termina todos os dias',
    example: '2023-09-18T17:00:00.000Z',
    type: String,
  })
  @IsString({ message: 'O horário final deve ser uma string.' })
  @IsISO8601()
  horario_final: string;

  @ApiProperty({
    description:
      'Número máximo de corridas que o entregador pode ignorar durante a campanha',
    example: 3,
    type: Number,
  })
  @IsInt({
    message: 'O limite de corridas ignoradas deve ser um número inteiro.',
  })
  @IsNotEmpty({
    message: 'O limite de corridas ignoradas não pode estar vazio.',
  })
  @Max(9999, {
    message: 'O limite de corridas ignoradas deve ser no máximo 9999.',
  })
  limite_corridas_ignoradas: number;

  @ApiProperty({
    description:
      'Número máximo de corridas que o entregador pode recusar durante a campanha',
    example: 2,
    type: Number,
  })
  @IsInt({
    message: 'O limite de corridas recusadas deve ser um número inteiro.',
  })
  @IsNotEmpty({
    message: 'O limite de corridas recusadas não pode estar vazio.',
  })
  @Max(9999, {
    message: 'O limite de corridas recusadas deve ser no máximo 9999.',
  })
  limite_corridas_recusadas: number;

  @ApiProperty({
    description:
      'Tempo (em minutos) que o entregador tem de tolerância para atrasos',
    example: '2023-09-18T09:15:00.000Z',
    type: String,
  })
  @IsString({ message: 'O tempo de tolerância deve ser uma string.' })
  @IsISO8601()
  tempo_de_tolerancia: string;

  @ApiProperty({
    description: 'Breve descrição sobre o objetivo e benefícios da campanha',
    example:
      'Participe da campanha de massas de Março e obtenha bônus por entrega!',
    type: String,
  })
  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  @Length(1, 500, { message: 'A descrição deve ter entre 1 e 500 caracteres.' })
  descricao: string;
}

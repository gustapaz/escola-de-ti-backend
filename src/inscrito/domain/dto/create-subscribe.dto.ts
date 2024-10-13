import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSubscribeDto {
  @ApiProperty({
    description: 'ID do entregador',
    example: '1234-5678',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_entregador: string;

  @ApiProperty({
    description: 'ID da campanha',
    example: 'abcd-efgh',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_campanha: string;

  @ApiProperty({
    description: 'Data de inscrição do entregador',
    example: '2023-09-21',
    type: String,
  })

  data_de_inscricao?: string;

  @ApiProperty({
    description: 'Número de corridas ignoradas pelo entregador',
    example: 5,
    type: Number,
  })
  entregas_ignoradas?: number;

  @ApiProperty({
    description: 'Número de corridas recusadas pelo entregador',
    example: 3,
    type: Number,
  })
  entregas_recusadas?: number;
}

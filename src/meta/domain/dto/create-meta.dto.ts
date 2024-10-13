import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreateMetaDto {
  @ApiProperty({
    description: 'Id identificador do entregador',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_inscrito: string;

  @ApiProperty({
    description: 'Id identificador da campanha',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_campanha: string;

  @ApiProperty({
    description: 'Id identificador do objetivo',
    example: '1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id_objetivo: string;

  @ApiProperty({
    description: 'Valor atingido pelo entregador',
    example: '0.25',
    type: String,
  })

  @IsNotEmpty()
  valor_atingido: number;
}

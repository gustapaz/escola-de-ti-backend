import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, Max, Min } from 'class-validator';
import { CreateMetaDto } from './create-meta.dto';

export class UpdateMetaDto extends PartialType(CreateMetaDto) {
  @ApiProperty({
    description: 'Valor atingido pelo entregador em porcentagem',
    example: 25,
    type: Number,
  })
  @IsNotEmpty()
  @Min(0, { message: 'O valor atingido não pode ser menor do que 0.' })
  @Max(10, { message: 'O valor atingido não pode ser maior do que 10.' })
  valor_atingido: number;
}

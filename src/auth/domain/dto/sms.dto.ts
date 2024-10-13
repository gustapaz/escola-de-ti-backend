import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(15)
    @ApiProperty({
    description: 'Telefone do entregador',
    example: '(00) 00000-0000',
    type: String,
    required: true,
    })
  telefone: string;
}

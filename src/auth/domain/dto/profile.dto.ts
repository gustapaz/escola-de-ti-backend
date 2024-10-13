import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    description: 'Nome do entregador',
    example: 'João',
    type: String,
    required: true,
  })
  nome: string;

  @ApiProperty({
    description: 'Moedas do entregador',
    example: '150',
    type: Number,
    required: true,
  })
  aiqcoins: number;
}

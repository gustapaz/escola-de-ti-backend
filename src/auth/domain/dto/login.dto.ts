import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  
  @ApiProperty({
    description: 'Id do entregador',
    example: '00000000-0000-0000-0000-000000000000',
    type: String,
    required: true,
  })
  id: string;
  
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email do entregador',
    example: 'joao.almeida@example.com',
    type: String,
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Senha do entregador',
    minLength: 8,
    example: 'senhaSegura123',
    type: String,
    required: true,
  })
  senha: string;
}

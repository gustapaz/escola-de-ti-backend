import { IsNumber, IsString } from 'class-validator';

export class CreateItemCarrinhoDto {
  @IsString()
  id_carrinho: string;
  @IsString()
  id_produto: string;
  @IsNumber()
  quantidade: number;
  @IsNumber()
  valor: number;
}

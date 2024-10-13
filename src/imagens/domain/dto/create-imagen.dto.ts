import { IsString } from 'class-validator';

export class CreateImagenDto {
  @IsString()
  url: string;
  @IsString()
  id_origem: string;
}

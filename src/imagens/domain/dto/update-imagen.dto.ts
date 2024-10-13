import { PartialType } from '@nestjs/swagger';
import { CreateImagenDto } from './create-imagen.dto';
import { IsString } from 'class-validator';

export class UpdateImagenDto extends PartialType(CreateImagenDto) {
  @IsString()
  url?: string;
  @IsString()
  id_origem?: string;
}

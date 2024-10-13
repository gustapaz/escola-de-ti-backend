import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateImagenDto } from '../dto/create-imagen.dto';
import { Imagen } from '../entities/imagen.entity';
import { ImagemRepository } from '../repository/imagem.repository';
import { ICreate } from '../../../shared/interfaces/create.interface';

@Injectable()
export class CreateImagenUseCase implements ICreate<CreateImagenDto, Imagen> {
  constructor(private readonly imagenRepository: ImagemRepository) {}

  async create(input: CreateImagenDto) {
    try {
      return await this.imagenRepository.create(input);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao salvar a imagem', error);
    }
  }
}

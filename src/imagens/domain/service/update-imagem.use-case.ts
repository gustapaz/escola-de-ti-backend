import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImagemRepository } from '../repository/imagem.repository';
import { IUpdate } from '../../../shared/interfaces/update.interface';
import { UpdateImagenDto } from '../dto/update-imagen.dto';
import { Imagen } from '../entities/imagen.entity';

@Injectable()
export class UpdateImagemUseCase implements IUpdate<UpdateImagenDto, Imagen> {
  constructor(private readonly imagemRepository: ImagemRepository) {}

  async update(id: string, input: UpdateImagenDto) {
    try {
      return await this.imagemRepository.update(id, input);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar a imagem',
        error,
      );
    }
  }
}

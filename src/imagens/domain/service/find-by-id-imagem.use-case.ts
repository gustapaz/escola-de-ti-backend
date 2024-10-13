import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImagemRepository } from '../repository/imagem.repository';
import { IFindById } from '../../../shared/interfaces/find-by-id.interface';
import { Imagen } from '../entities/imagen.entity';
@Injectable()
export class FindByIdImagemUseCase implements IFindById<Imagen> {
  constructor(private readonly imagemRepository: ImagemRepository) {}

  async findById(id: string) {
    try {
      return await this.imagemRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar a imagem', error);
    }
  }
}

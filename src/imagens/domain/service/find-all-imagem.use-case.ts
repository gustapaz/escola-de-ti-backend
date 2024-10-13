import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImagemRepository } from '../repository/imagem.repository';

@Injectable()
export class FindAllImagensUseCase {
  constructor(private readonly imagensRepository: ImagemRepository) {}

  async findAll() {
    try {
      return await this.imagensRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar as imagens', error);
    }
  }
}

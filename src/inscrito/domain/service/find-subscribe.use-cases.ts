import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Subscribe } from '../entities/subscribe.entity';
import { SubscribeRepository } from '../repository/subscribe.repository';

@Injectable()
export class FindSubscribeUseCase {
  constructor(private readonly subscribeRepository: SubscribeRepository) { }

  async findAll(): Promise<Subscribe[]> {
    try {
      return await this.subscribeRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar Inscritos', error);
    }
  }

  async findOne(id: string): Promise<Subscribe> {
    try {
      return await this.subscribeRepository.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar Inscrito por id', error);
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SubscribeRepository } from '../repository/subscribe.repository';

@Injectable()
export class DeleteSubscribeUseCase {
  constructor(private readonly subscribeRepository: SubscribeRepository) {}

  async delete(id: string): Promise<void> {
    try {
      return await this.subscribeRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar Inscrito', error);
    }
  }
}

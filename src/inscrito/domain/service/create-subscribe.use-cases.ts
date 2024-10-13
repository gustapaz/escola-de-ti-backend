import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Subscribe } from '../entities/subscribe.entity';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { CreateSubscribeDto } from '../dto/create-subscribe.dto';
import { createdAt } from '../../../shared/utils/created-at';

@Injectable()
export class CreateSubscribeUseCase {
  constructor(private readonly subscribeRepository: SubscribeRepository) {}

  async create(input: CreateSubscribeDto): Promise<Subscribe> {
    try {
      const subscribe = {
        ...input,
        entregas_ignoradas: 0,
        entregas_recusadas: 0,
        data_de_inscricao: createdAt,
      }
      return await this.subscribeRepository.create(subscribe);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar Inscrito', error);
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Subscribe } from '../entities/subscribe.entity';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { UpdateSubscribeDto } from '../dto/update-subscribe.dto';

@Injectable()
export class UpdateSubscribeUseCase {
  constructor(private readonly subscribeRepository: SubscribeRepository) {}

  async update(
    id: string,
    input: UpdateSubscribeDto,
  ): Promise<Subscribe> {
    try {
      return await this.subscribeRepository.update(id, input);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar Inscrito', error);
    }
  }
}

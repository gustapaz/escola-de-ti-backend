import { MotoboyRepository } from '../repository/motoboy.repository';
import { UpdateMotoboyRequestDto } from '../dto/update-motoboy-request.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMotoboyResponseDto } from '../dto/update-motoboy-response.dto';

@Injectable()
export class UpdateMotoboyUseCase {
  constructor(
    private readonly motoboyRepository: MotoboyRepository
  ) { }

  async update(id: string, input: UpdateMotoboyRequestDto): Promise<UpdateMotoboyResponseDto> {
    const motoboy = await this.motoboyRepository.findById(id);
    if (!motoboy) {
      throw new NotFoundException('Entregador não encontrado');
    }
    try {
      const motoboyUpdated: UpdateMotoboyRequestDto = {
        nome: input.nome,
        sobrenome: input.sobrenome,
        email: input.email,
        telefone: input.telefone,
        data_de_nascimento: input.data_de_nascimento,
        mochila: input.mochila,
        aiqcoins: input.aiqcoins,
        cidade: input.cidade,
      };

      const updateMotoboy = await this.motoboyRepository.update(
        id,
        motoboyUpdated,
      );

      return updateMotoboy;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar Entregador',
        error,
      );
    }
  }
}

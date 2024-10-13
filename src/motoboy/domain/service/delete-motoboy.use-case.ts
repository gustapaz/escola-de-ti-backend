import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MotoboyRepository } from '../repository/motoboy.repository';

@Injectable()
export class DeleteMotoboyUseCase {
    constructor(private readonly motoboyRepository: MotoboyRepository) {}

    async delete(id: string): Promise<void> {
        try {
            return await this.motoboyRepository.delete(id);
        } catch (error) {
            throw new InternalServerErrorException('Erro ao deletar Entregador', error);
        }
    }
}
import { Motoboy } from '../entities/motoboy.entity';
import { MotoboyRepository } from '../repository/motoboy.repository';
import { CreateMotoboyDto } from '../dto/create-motoboy.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CreateMotoboyUseCase {
    constructor(private readonly motoboyRepository: MotoboyRepository) {}

    async create(input: CreateMotoboyDto): Promise<Motoboy> {
        try {
        return await this.motoboyRepository.create(input);
        } catch (error) {
            throw new InternalServerErrorException('Erro ao criar Entregador', error);
        }
    }

}
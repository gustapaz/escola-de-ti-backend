import { CreateMotoboyDto } from '../dto/create-motoboy.dto';
import { UpdateMotoboyResponseDto } from '../dto/update-motoboy-response.dto';
import { Motoboy } from '../entities/motoboy.entity';

export abstract class MotoboyRepository {
  abstract create(input: CreateMotoboyDto): Promise<Motoboy>;
  abstract findAll(): Promise<Motoboy[]>;
  abstract findById(id: string): Promise<Motoboy>;
  abstract findByEmail(email: string): Promise<Motoboy>;
  abstract profile(email: string): Promise<Motoboy>;
  abstract update(id: string, input: UpdateMotoboyResponseDto): Promise<Motoboy>;
  abstract updateAiqcoins(id: string, input: any): Promise<Motoboy>;
  abstract delete(id: string): Promise<void>;
}

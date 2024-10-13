import { CreateSubscribeDto } from '../dto/create-subscribe.dto';
import { UpdateSubscribeDto } from '../dto/update-subscribe.dto';
import { Subscribe } from '../entities/subscribe.entity';

export abstract class SubscribeRepository {
  abstract create(input: CreateSubscribeDto): Promise<Subscribe>;

  abstract update(id: string, input: UpdateSubscribeDto): Promise<Subscribe>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<Subscribe[]>;

  abstract findOne(id: string): Promise<Subscribe>;
}

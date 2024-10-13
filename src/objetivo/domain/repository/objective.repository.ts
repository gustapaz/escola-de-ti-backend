import { CreateObjectiveDto } from '../dto/create-objective.dto';
import { UpdateObjectiveDto } from '../dto/update-objective.dto';
import { Objective } from '../entities/objetivo.entity';

export abstract class ObjectiveRepository {
  abstract create(input: CreateObjectiveDto): Promise<Objective>;

  abstract update(id: string, input: UpdateObjectiveDto): Promise<Objective>;

  abstract delete(id: string): Promise<void>;

  abstract findAll(): Promise<Objective[]>;

  abstract findOne(id: string): Promise<Objective>;
}

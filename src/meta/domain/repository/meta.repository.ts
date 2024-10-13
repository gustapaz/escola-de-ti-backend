import { CreateMetaDto } from '../dto/create-meta.dto';
import { UpdateMetaDto } from '../dto/update-meta.dto';
import { Meta } from '../entities/meta.entity';

export abstract class MetaRepository {
  abstract create(createMetaDto: CreateMetaDto): Promise<Meta>;

  abstract update(
    idObjetivo: string,
    idInscrito: string,
    input: UpdateMetaDto,
  ): Promise<Meta>;

  abstract delete(idObjetivo: string, idInscrito: string): Promise<void>;

  abstract findAll(): Promise<Meta[]>;

  abstract findOne(idObjetivo: string, idInscrito: string): Promise<Meta>;
}

import { CreateImagenDto } from "../dto/create-imagen.dto";
import { UpdateImagenDto } from "../dto/update-imagen.dto";
import { Imagen } from "../entities/imagen.entity";

export abstract class ImagemRepository {
    abstract create(input: CreateImagenDto): Promise<Imagen>;
    abstract findAll(): Promise<Imagen[]>;
    abstract findById(id: string): Promise<Imagen>;
    abstract update(id: string, input: UpdateImagenDto): Promise<Imagen>;
    abstract delete(id: string): Promise<void>;
}

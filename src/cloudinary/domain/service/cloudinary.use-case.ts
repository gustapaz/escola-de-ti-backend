import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ICloudinaryProvider } from '../interfaces/icloudinary.provider';

@Injectable()
export class CloudinaryUseCase {
  constructor(private readonly cloudinaryProvider: ICloudinaryProvider) {}

  async uploadImage(file: Express.Multer.File) {
    try {
      return await this.cloudinaryProvider.uploadImage(file);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao fazer upload da imagem', error);
    }
  }
}

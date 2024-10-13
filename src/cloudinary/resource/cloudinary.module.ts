import { Module } from '@nestjs/common';
import { CloudinaryUseCase } from '../domain/service/cloudinary.use-case';
import { CloudinaryProvider } from '../data-access/infraestructure/storage/cloudinary.provider';
import { ICloudinaryProvider } from '../domain/interfaces/icloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [
    CloudinaryUseCase,
    {
      provide: ICloudinaryProvider,
      useClass: CloudinaryProvider,
    }
  ],
  exports: [CloudinaryUseCase],
})
export class CloudinaryModule {}

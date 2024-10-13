import { v2, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ICloudinaryProvider } from '../../../domain/interfaces/icloudinary.provider';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryProvider implements ICloudinaryProvider {
  constructor(private configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        { folder: 'images/premios' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (result) {
            resolve(result.secure_url);
          } else {
            reject(error);
          }
        },
      );

      toStream(file.buffer).pipe(uploadStream);
      return uploadStream;
    });
  }
}

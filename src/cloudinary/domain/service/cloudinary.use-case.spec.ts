import { Test, TestingModule } from '@nestjs/testing';
import { ICloudinaryProvider } from '../interfaces/icloudinary.provider';
import { CloudinaryUseCase } from './cloudinary.use-case';

describe('CloudinaryUseCase', () => {
  let service: CloudinaryUseCase;
  let mockCloudinaryProvider: jest.Mocked<ICloudinaryProvider>;

  beforeEach(async () => {
    mockCloudinaryProvider = {
      uploadImage: jest.fn(),
    } as unknown as jest.Mocked<ICloudinaryProvider>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryUseCase,
        {
          provide: ICloudinaryProvider,
          useValue: mockCloudinaryProvider,
        },
      ],
    }).compile();

    service = module.get<CloudinaryUseCase>(CloudinaryUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockCloudinaryProvider.uploadImage.mockRejectedValue(new Error('Fake error'));

    await expect(service.uploadImage({} as Express.Multer.File)).rejects.toThrowError();
  });
});
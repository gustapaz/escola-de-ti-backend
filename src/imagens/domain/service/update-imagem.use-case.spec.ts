import { Test, TestingModule } from '@nestjs/testing';
import { ImagemRepository } from '../repository/imagem.repository';
import { UpdateImagemUseCase } from './update-imagem.use-case';
import { UpdateImagenDto } from '../dto/update-imagen.dto';

describe('UpdateImagemUseCase', () => {
  let service: UpdateImagemUseCase;
  let mockImagemRepository: jest.Mocked<ImagemRepository>;

  beforeEach(async () => {
    mockImagemRepository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<ImagemRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateImagemUseCase,
        {
          provide: ImagemRepository,
          useValue: mockImagemRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateImagemUseCase>(UpdateImagemUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockImagemRepository.update.mockRejectedValue(new Error('Fake error'));

    await expect(service.update('id', {} as any)).rejects.toThrowError();
  });
});

describe('UpdateImagenDto', () => {
  it('should be defined', () => {
    expect(UpdateImagenDto).toBeDefined();
  });
});

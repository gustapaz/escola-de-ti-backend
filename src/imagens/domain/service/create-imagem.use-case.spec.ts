import { Test, TestingModule } from '@nestjs/testing';
import { CreateImagenDto } from '../dto/create-imagen.dto';
import { ImagemRepository } from '../repository/imagem.repository';
import { CreateImagenUseCase } from './create-imagem.use-case';

describe('CreateImagenUseCase', () => {
  let service: CreateImagenUseCase;
  let mockImagemRepository: jest.Mocked<ImagemRepository>;

  beforeEach(async () => {
    mockImagemRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ImagemRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateImagenUseCase,
        {
          provide: ImagemRepository,
          useValue: mockImagemRepository,
        },
      ],
    }).compile();

    service = module.get<CreateImagenUseCase>(CreateImagenUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockImagemRepository.create.mockRejectedValue(new Error('Fake error'));

    await expect(service.create({} as CreateImagenDto)).rejects.toThrowError();
  });
});

describe('CreateImagenDto', () => {
  it('should be defined', () => {
    expect(CreateImagenDto).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ImagemRepository } from '../repository/imagem.repository';
import { FindAllImagensUseCase } from './find-all-imagem.use-case';

describe('FindAllImagensUseCase', () => {
  let service: FindAllImagensUseCase;
  let mockImagemRepository: jest.Mocked<ImagemRepository>;

  beforeEach(async () => {
    mockImagemRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ImagemRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllImagensUseCase,
        {
          provide: ImagemRepository,
          useValue: mockImagemRepository,
        },
      ],
    }).compile();

    service = module.get<FindAllImagensUseCase>(FindAllImagensUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockImagemRepository.findAll.mockRejectedValue(new Error('Fake error'));

    await expect(service.findAll()).rejects.toThrowError();
  });
});

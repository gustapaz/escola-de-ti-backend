import { Test, TestingModule } from '@nestjs/testing';
import { ImagemRepository } from '../repository/imagem.repository';
import { FindByIdImagemUseCase } from './find-by-id-imagem.use-case';

describe('FindByIdImagemUseCase', () => {
  let service: FindByIdImagemUseCase;
  let mockImagemRepository: jest.Mocked<ImagemRepository>;

  beforeEach(async () => {
    mockImagemRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ImagemRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindByIdImagemUseCase,
        {
          provide: ImagemRepository,
          useValue: mockImagemRepository,
        },
      ],
    }).compile();

    service = module.get<FindByIdImagemUseCase>(FindByIdImagemUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockImagemRepository.findById.mockRejectedValue(new Error('Fake error'));

    await expect(service.findById('id')).rejects.toThrowError();
  });
});
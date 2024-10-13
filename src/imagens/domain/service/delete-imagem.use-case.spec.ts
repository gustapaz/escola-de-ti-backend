import { Test, TestingModule } from '@nestjs/testing';
import { ImagemRepository } from '../repository/imagem.repository';
import { DeleteImagensUseCase } from './delete-imagem.use-case';

describe('DeleteImagensUseCase', () => {
  let service: DeleteImagensUseCase;
  let mockImagemRepository: jest.Mocked<ImagemRepository>;

  beforeEach(async () => {
    mockImagemRepository = {
      delete: jest.fn(),
    } as unknown as jest.Mocked<ImagemRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteImagensUseCase,
        {
          provide: ImagemRepository,
          useValue: mockImagemRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteImagensUseCase>(DeleteImagensUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockImagemRepository.delete.mockRejectedValue(new Error('Fake error'));

    await expect(service.delete('id')).rejects.toThrowError();
  });
});

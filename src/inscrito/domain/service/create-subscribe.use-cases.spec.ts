import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { CreateSubscribeUseCase } from './create-subscribe.use-cases';
import { CreateSubscribeDto } from '../dto/create-subscribe.dto';

describe('CreateSubscribeUseCase', () => {
  let createSubscribeUseCase: CreateSubscribeUseCase;
  let mockSubscribeRepository: Partial<jest.Mocked<SubscribeRepository>>;

  beforeEach(async () => {
    mockSubscribeRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSubscribeUseCase,
        {
          provide: SubscribeRepository,
          useValue: mockSubscribeRepository,
        },
      ],
    }).compile();

    createSubscribeUseCase = module.get<CreateSubscribeUseCase>(
      CreateSubscribeUseCase,
    );
  });

  it('should be defined', () => {
    expect(createSubscribeUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when SubscribeRepository.create fails', async () => {
    mockSubscribeRepository.create.mockRejectedValueOnce(
      new Error('Erro ao criar Inscrito'),
    );

    const mockSubscribeDto: CreateSubscribeDto = {
      id_entregador: '1234-5678',
      id_campanha: 'abcd-efgh',
      data_de_inscricao: '2023-09-21',
      entregas_ignoradas: 5,
      entregas_recusadas: 3,
    };
    await expect(
      createSubscribeUseCase.create(mockSubscribeDto),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

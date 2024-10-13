import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { SubscribeRepository } from '../repository/subscribe.repository';
import { UpdateSubscribeUseCase } from './update-subscribe.use-cases';
import { UpdateSubscribeDto } from '../dto/update-subscribe.dto';

describe('UpdateSubscribeUseCase', () => {
  let updateSubscribeUseCase: UpdateSubscribeUseCase;
  let mockSubscribeRepository: Partial<jest.Mocked<SubscribeRepository>>;

  beforeEach(async () => {
    mockSubscribeRepository = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSubscribeUseCase,
        {
          provide: SubscribeRepository,
          useValue: mockSubscribeRepository,
        },
      ],
    }).compile();

    updateSubscribeUseCase = module.get<UpdateSubscribeUseCase>(
      UpdateSubscribeUseCase,
    );
  });

  it('should be defined', () => {
    expect(updateSubscribeUseCase).toBeDefined();
  });

  it('should throw InternalServerErrorException when SubscribeRepository.update fails', async () => {
    const mockSubscribeId = 'mockId';
    const mockUpdateDto: UpdateSubscribeDto = {
      id_entregador: '8765-4321',
      id_campanha: 'hgef-dcba',
      data_de_inscricao: '2023-09-21',
      entregas_ignoradas: 5,
      entregas_recusadas: 3,
    };

    mockSubscribeRepository.update.mockRejectedValueOnce(
      new Error('Erro ao atualizar Inscrito'),
    );

    await expect(
      updateSubscribeUseCase.update(mockSubscribeId, mockUpdateDto),
    ).rejects.toThrow(InternalServerErrorException);
  });
});

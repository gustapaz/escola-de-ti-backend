import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMotoboyAiqcoinsUseCase } from './update-motoboy-aiqcoins.use-case';

describe('UpdateMotoboyAiqcoinsUseCase', () => {
  let service: UpdateMotoboyAiqcoinsUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      updateAiqcoins: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMotoboyAiqcoinsUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateMotoboyAiqcoinsUseCase>(
      UpdateMotoboyAiqcoinsUseCase,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.findById.mockResolvedValue({
      id: '1',
      nome: 'Nome Teste',
      sobrenome: 'Sobrenome Teste',
      cpf: '123.456.789-01',
      cnpj: '12.345.678/0001-90',
      email: 'teste@email.com',
      telefone: '(11) 12345-6789',
      data_de_nascimento: '01/01/2000',
      senha: 'senhaTeste123',
      data_de_cadastro: '01/01/2021',
      mochila: true,
      status: true,
      token_dispositivo: 'tokenTeste',
      aiqcoins: 1,
      entregas_realizadas: 5,
      cidade: 'Cidade Teste',
    });

    mockMotoboyRepository.updateAiqcoins.mockRejectedValue(
      new Error('Fake error'),
    );
    await expect(service.update('1', 1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw NotFoundException when motoboy is not found', async () => {
    mockMotoboyRepository.findById.mockResolvedValue(null);
    await expect(async () => {
      await service.update('1', { aiqcoins: 2 });
    }).rejects.toThrow(NotFoundException);
    expect(mockMotoboyRepository.findById).toBeCalledWith('1');
  });
});

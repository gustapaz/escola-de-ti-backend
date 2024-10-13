import { Test, TestingModule } from '@nestjs/testing';
import { MotoboyRepository } from '../repository/motoboy.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMotoboyUseCase } from './update-motoboy.use-case';
import { UpdateMotoboyRequestDto } from '../dto/update-motoboy-request.dto';
import { UpdateMotoboyResponseDto } from '../dto/update-motoboy-response.dto';

describe('UpdateMotoboyUseCase', () => {
  let service: UpdateMotoboyUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      update: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMotoboyUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateMotoboyUseCase>(UpdateMotoboyUseCase);
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
    mockMotoboyRepository.update.mockRejectedValue(new Error('Fake error'));

    await expect(
      service.update('1', {} as UpdateMotoboyRequestDto),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw NotFoundException when motoboy is not found', async () => {
    mockMotoboyRepository.findById.mockResolvedValue(null);

    await expect(async () => {
      await service.update('1', {} as UpdateMotoboyRequestDto);
    }).rejects.toThrow(NotFoundException);
    expect(mockMotoboyRepository.findById).toBeCalledWith('1');
  });
});

describe('UpdateMotoboyRequestDto', () => {
  it('should be defined', () => {
    expect(UpdateMotoboyRequestDto).toBeDefined();
  });
});

describe('UpdateMotoboyResponseDto', () => {
  it('should be defined', () => {
    expect(UpdateMotoboyResponseDto).toBeDefined();
  });
});

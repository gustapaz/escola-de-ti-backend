import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUseCase } from './register.use-case';
import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let mockRepository: Partial<MotoboyRepository>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        { provide: MotoboyRepository, useValue: mockRepository },
      ],
    }).compile();

    registerUseCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(registerUseCase).toBeDefined();
  });

  it('should throw an InternalServerErrorException on trying to register', async () => {
    const mockRegister = {
      nome: 'Silva',
      sobrenome: 'Kleber',
      cpf: '11111111111',
      cnpj: '11111111111111',
      email: 'emailteste005@gmail.com',
      telefone: '44999999999',
      data_de_nascimento: '01/01/2000',
      senha: '12345678',
      mochila: true,
      cidade: 'Maringá',
    };
    (mockRepository.create as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(registerUseCase.register(mockRegister)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw a ConflictException on trying to register with an email that already exists', async () => {
    const mockRegister = {
      nome: 'Silva',
      sobrenome: 'Kleber',
      cpf: '11111111111',
      cnpj: '11111111111111',
      email: 'emailteste005@gmail.com',
      telefone: '44999999999',
      data_de_nascimento: '01/01/2000',
      senha: '12345678',
      mochila: true,
      cidade: 'Maringá',
    };
    const uniqueViolationError = new Error('Unique violation') as Error & { code: string };
    uniqueViolationError.code = '23505'; // Mimic the unique violation error code

    (mockRepository.create as jest.Mock).mockRejectedValueOnce(uniqueViolationError);

    await expect(registerUseCase.register(mockRegister)).rejects.toThrow(
      ConflictException,
    );
  });
});

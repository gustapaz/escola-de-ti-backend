import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from './login.use-case';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto';

describe('LoginUseCase', () => {
  let service: LoginUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    mockJwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockRefreshTokenRepository = {
      updateAccount: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: MotoboyRepository,
          useValue: mockMotoboyRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RefreshTokenRepository,
          useValue: mockRefreshTokenRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException when motoboy is not found', async () => {
    mockMotoboyRepository.findByEmail.mockResolvedValue(null);

    await expect(async () => {
      await service.login({} as LoginDto);
    }).rejects.toThrow(NotFoundException);
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    mockMotoboyRepository.findByEmail.mockRejectedValue(
      new Error('Fake error'),
    );

    await expect(async () => {
      await service.login({} as LoginDto);
    }).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when there is an error in GenerateToken', async () => {
    mockJwtService.signAsync.mockRejectedValue(new Error('Fake error'));

    await expect(async () => {
      await service.generateToken('1', 'email');
    }).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw BadRequestException if stored password format is invalid', async () => {
    mockMotoboyRepository.findByEmail.mockResolvedValue({
      id: '1',
      nome: 'Nome Teste',
      sobrenome: 'Sobrenome Teste',
      cpf: '123.456.789-01',
      cnpj: '12.345.678/0001-90',
      email: 'teste@email.com',
      telefone: '(11) 12345-6789',
      data_de_nascimento: '01/01/2000',
      senha: 'invalidPasswordFormat',
      data_de_cadastro: '01/01/2021',
      mochila: true,
      status: true,
      token_dispositivo: 'tokenTeste',
      aiqcoins: 1,
      entregas_realizadas: 5,
      cidade: 'Cidade Teste',
    });
    await expect(async () => {
      await service.validateEntregador('email', 'senha');
    }).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if password is invalid', async () => {
    mockMotoboyRepository.findByEmail.mockResolvedValue({
      id: '1',
      nome: 'Nome Teste',
      sobrenome: 'Sobrenome Teste',
      cpf: '123.456.789-01',
      cnpj: '12.345.678/0001-90',
      email: 'email',
      telefone: '(11) 12345-6789',
      data_de_nascimento: '01/01/2000',
      senha: 'senha',
      data_de_cadastro: '01/01/2021',
      mochila: true,
      status: true,
      token_dispositivo: 'tokenTeste',
      aiqcoins: 1,
      entregas_realizadas: 5,
      cidade: 'Cidade Teste',
    });
    await expect(async () => {
      await service.validateEntregador('email', 'senha');
    }).rejects.toThrow(BadRequestException);
  });
});

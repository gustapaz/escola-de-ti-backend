import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenUseCase } from './refresh-token.use-case';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LoginUseCase } from './login.use-case';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('RefreshTokenUseCase', () => {
  let service: RefreshTokenUseCase;
  let mockMotoboyRepository: jest.Mocked<MotoboyRepository>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    mockMotoboyRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<MotoboyRepository>;

    mockJwtService = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockRefreshTokenRepository = {
      getStoredTokens: jest.fn(),
      updateAccount: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    mockConfigService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    mockLoginUseCase = {
      generateToken: jest.fn(),
    } as unknown as jest.Mocked<LoginUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
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

    service = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException when refresh token is not found', async () => {
    const motoboyId = 'motoboyId';
    const refreshToken = 'refreshToken';

    mockRefreshTokenRepository.getStoredTokens.mockResolvedValueOnce(null);

    await expect(service.refreshToken(motoboyId, refreshToken)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw InternalServerErrorException when motoboy is not found', async () => {
    const motoboyId = 'motoboyId';
    const refreshToken = 'refreshToken';
    mockRefreshTokenRepository.getStoredTokens.mockResolvedValueOnce([
      'access_token',
      'refresh_token',
    ]);
    mockMotoboyRepository.findById.mockResolvedValueOnce(null);
    mockRefreshTokenRepository.updateAccount.mockResolvedValueOnce(null);

    await expect(service.refreshToken(motoboyId, refreshToken)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw InternalServerErrorException when there is an error', async () => {
    const motoboyId = 'motoboyId';
    const refreshToken = 'refreshToken';

    mockRefreshTokenRepository.getStoredTokens.mockResolvedValueOnce([
      'access_token',
      'refresh_token',
    ]);
    mockRefreshTokenRepository.updateAccount.mockRejectedValueOnce(new Error());

    await expect(service.refreshToken(motoboyId, refreshToken)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should refresh token successfully', async () => {
    mockRefreshTokenRepository.getStoredTokens.mockResolvedValueOnce([
      'access_token',
      'refresh_token',
    ]);
    mockMotoboyRepository.findById.mockResolvedValueOnce({
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

    mockLoginUseCase.generateToken.mockResolvedValueOnce({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    });

    mockRefreshTokenRepository.updateAccount.mockResolvedValueOnce(null);

    await expect(service.refreshToken('1', 'refresh_token')).resolves.toEqual({
      access_token: 'access_token',
      refresh_token: 'refresh_token',
    });
  });
});

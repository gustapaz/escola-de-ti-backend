import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../domain/service/login.use-case';
import { RegisterUseCase } from '../domain/service/register.use-case';
import { ProfileUseCase } from '../domain/service/profile.use-case';
import { RefreshTokenUseCase } from '../domain/service/refresh-token.use-case';
import { SmsUseCase } from '../domain/service/sms.use-case';
import { ProfileDto } from '../domain/dto/profile.dto';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
  profile: jest.fn(),
  refreshToken: jest.fn(),
};

const mockSmsUseCase = {
  generateCode: jest.fn(),
  validateCode: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockAuthService,
        },
        {
          provide: RegisterUseCase,
          useValue: mockAuthService,
        },
        {
          provide: ProfileUseCase,
          useValue: mockAuthService,
        },
        {
          provide: RefreshTokenUseCase,
          useValue: mockAuthService,
        },
        {
          provide: SmsUseCase,
          useValue: mockSmsUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call login with correct params and return the result', async () => {
      const loginDto = {
        id: '001',
        email: 'test@email.com',
        senha: 'password',
      };
      mockAuthService.login.mockResolvedValueOnce({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
      });
    });
  });

  describe('register', () => {
    it('should call signUp with correct params and return the result', async () => {
      const registerDto = {
        cnpj: '44.975.351/0001-93',
        cpf: '111.111.111-11',
        nome: 'Entregador7',
        sobrenome: 'Sobrenome4',
        email: 'joaoAlmeida02@gmail.com',
        data_de_nascimento: '05/09/2023',
        senha: 'senha123',
        mochila: false,
        cidade: 'Maringa',
        telefone: '(44) 99999-9999',
      };

      const registerMotoboy = {
        ...registerDto,
      };
      mockAuthService.register.mockResolvedValueOnce(registerMotoboy);

      const result = await controller.create(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(registerMotoboy);
    });
  });

  describe('Profile', () => {
    it('should call profile with correct email and return the result', async () => {
      const mockReq = {
        user: {
          email: 'test@email.com',
        },
      };

      const profileDto: ProfileDto = {
        nome: 'João',
        aiqcoins: 150,
      };

      mockAuthService.profile.mockResolvedValueOnce(profileDto);

      const result = await controller.getProfile(mockReq as any);

      expect(mockAuthService.profile).toHaveBeenCalledWith(mockReq.user.email);
      expect(result).toEqual(profileDto);
    });
  });

  describe('getRefreshToken', () => {
    it('should call refreshToken with correct params and return the result', async () => {
      const mockReq = {
        user: {
          sub: 'mockMotoboyId',
          refreshToken: 'mockRefreshToken',
        },
      };

      const expectedRefreshTokenResult = {
        newAccessToken: 'mockAccessToken',
        newRefreshToken: 'mockRefreshToken',
      };

      mockAuthService.refreshToken.mockResolvedValueOnce(
        expectedRefreshTokenResult,
      );

      const result = await controller.getRefreshToken(mockReq as any);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        mockReq.user.sub,
        mockReq.user.refreshToken,
      );
      expect(result).toEqual(expectedRefreshTokenResult);
    });
  });

  describe('validateCode', () => {
    it('should call validateCode with correct telefone and codigo and return the result', async () => {
      const mockBody = {
        telefone: '+1234567890',
        codigo: 123456
      };
      const expectedValidateCodeResult = {
        success: true
      };
  
      mockSmsUseCase.validateCode.mockResolvedValueOnce(expectedValidateCodeResult);
  
      const result = await controller.validateCode(mockBody);
  
      expect(mockSmsUseCase.validateCode).toHaveBeenCalledWith(mockBody.telefone, mockBody.codigo);
      expect(result).toEqual(expectedValidateCodeResult);
    });
  });
  
  describe('generateCode', () => {
    it('should call generateCode with correct telefone and return the result', async () => {
      const mockBody = {
        telefone: '(44) 99999-9999'
      };
      const expectedGenerateCodeResult = {
        success: true
      };
  
      mockSmsUseCase.generateCode.mockResolvedValueOnce(expectedGenerateCodeResult);
  
      const result = await controller.generateCode(mockBody);
  
      expect(mockSmsUseCase.generateCode).toHaveBeenCalledWith(mockBody.telefone);
      expect(result).toEqual(expectedGenerateCodeResult);
    });
  });
  
});

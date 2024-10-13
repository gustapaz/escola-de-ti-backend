import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../domain/service/login.use-case';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let mockLoginUseCase: jest.Mocked<LoginUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: LoginUseCase,
          useValue: {
            validateEntregador: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    mockLoginUseCase = module.get(LoginUseCase);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if validation is successful', async () => {
      const mockUser = {
        id: 'id',
        email: 'emailtest@example.com',
        senha: 'senha123',
      };
      mockLoginUseCase.validateEntregador.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(
        'emailtest@example.com',
        'senha123',
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw an unauthorized exception if validation fails', async () => {
      mockLoginUseCase.validateEntregador.mockResolvedValue(null);

      await expect(
        localStrategy.validate('emailtest@example.com', 'senha123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockLoginUseCase.validateEntregador).toHaveBeenCalled();
    });
  });
});

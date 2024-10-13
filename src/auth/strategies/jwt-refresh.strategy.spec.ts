import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { RefreshTokenStrategy } from './jwt-refresh.strategy';

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;
  let payload: { email: string; sub: string };

  beforeEach(() => {
    process.env.KEY = 'fake_key';
    strategy = new RefreshTokenStrategy();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    beforeEach(() => {
      payload = { email: 'emailtest@example.com', sub: 'senha123' };
    });

    it('should throw an UnauthorizedException if Authorization header is missing', async () => {
      const mockReq: any = { get: jest.fn().mockReturnValue(undefined) };
      await expect(strategy.validate(mockReq, payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if payload is undefined', async () => {
      const mockReq: any = { get: jest.fn().mockReturnValue('Bearer token') };
      await expect(strategy.validate(mockReq, undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return the payload with the refresh token', async () => {
      const mockReq: any = {
        get: jest.fn((headerName: string) =>
          headerName === 'Authorization' ? 'Bearer token' : undefined,
        ),
      };
      const result = await strategy.validate(mockReq, payload);
      expect(result).toEqual({ ...payload, refreshToken: 'token' });
    });
  });
});

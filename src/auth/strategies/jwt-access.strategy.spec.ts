import { JwtStrategy } from './jwt-access.strategy';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.KEY = 'fake_key';
    strategy = new JwtStrategy();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return the payload if it exists', async () => {
      const mockPayload = 'validPayload';
      const result = await strategy.validate(mockPayload);
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException if payload does not exist', async () => {
      await expect(strategy.validate('')).rejects.toThrow(UnauthorizedException);
    });
  });
});

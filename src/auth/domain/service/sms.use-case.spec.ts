import { SmsUseCase } from './sms.use-case';
import { BadRequestException } from '@nestjs/common';

describe('SmsUseCase', () => {
  let smsUseCase: SmsUseCase;

  beforeEach(() => {
    smsUseCase = new SmsUseCase();
  });

  it('should be defined', () => {
    expect(smsUseCase).toBeDefined();
  });

  it('should generate a new code and store it', async () => {
    const phone = '123456789';
    const code = await smsUseCase.generateCode(phone);
    expect(code).toBeDefined();
    expect(smsUseCase.getTempPhones()).toContain(phone);
  });

  it('should validate the code correctly', async () => {
    const phone = '123456789';
    const code = await smsUseCase.generateCode(phone);
    const validationResult = await smsUseCase.validateCode(phone, code);
    expect(validationResult).toBe(true);
  });

  it('should throw BadRequestException when validating an invalid code', async () => {
    const phone = '1234567890';
    const invalidCode = 9999;

    await smsUseCase.generateCode(phone);

    await expect(smsUseCase.validateCode(phone, invalidCode)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should get temporary phones', async () => {
    const tempPhones = smsUseCase.getTempPhones();
    expect(Array.from(tempPhones)).toEqual([]);
  });
});

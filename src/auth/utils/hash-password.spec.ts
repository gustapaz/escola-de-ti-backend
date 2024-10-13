import { randomBytes } from 'crypto';
import { hashPassword } from './hash-password';

describe('hashPassword', () => {
  it('should be defined', () => {
    expect(hashPassword).toBeDefined();
  });

  it('should return a hashed password', () => {
    const password = 'password';
    const salt = randomBytes(16).toString('hex');
    const result = hashPassword(password, salt);
    expect(result).toBeDefined();
    expect(result).not.toEqual(password);
    expect(result).not.toEqual(salt);
  });
});

import { dataAtual, createdAt } from './created-at';

describe('Data tests', () => {
  it('should define dataAtual as an instance of Date', () => {
    expect(dataAtual).toBeInstanceOf(Date);
  });

  it('should define createdAt as an ISO string', () => {
    const testDate = new Date(createdAt);
    expect(testDate.toISOString()).toBe(createdAt);
  });
});

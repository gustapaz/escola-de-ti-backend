import { removeCnpjMask, removeCpfMask, removePhoneMask } from './remove-mask';

describe('Remove Mask', () => {
  describe('Phone Mask', () => {
    it('should be defined', () => {
      expect(removePhoneMask).toBeDefined();
    });

    it('should remove phone mask', () => {
      const phone = '(11) 99999-9999';
      const result = removePhoneMask(phone);
      expect(result).toEqual('11999999999');
    });
  });

  describe('CPF Mask', () => {
    it('should be defined', () => {
      expect(removeCpfMask).toBeDefined();
    });

    it('should remove cpf mask', () => {
      const cpf = '123.456.789-00';
      const result = removeCpfMask(cpf);
      expect(result).toEqual('12345678900');
    });
  });

  describe('CNPJ Mask', () => {
    it('should be defined', () => {
      expect(removeCnpjMask).toBeDefined();
    });

    it('should remove cnpj mask', () => {
      const cnpj = '12.345.678/0001-00';
      const result = removeCnpjMask(cnpj);
      expect(result).toEqual('12345678000100');
    });
  });
});

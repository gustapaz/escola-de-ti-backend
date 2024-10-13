import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { hashPassword } from '../../utils/hash-password';
import {
  removePhoneMask,
  removeCpfMask,
  removeCnpjMask,
} from '../../../shared/utils/remove-mask';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly motoboyRepository: MotoboyRepository,
  ) {}

  async register(input: RegisterDto): Promise<any> {
    try {
      const hashedPassword = hashPassword(input.senha);
      const phoneWithoutMask = removePhoneMask(input.telefone);
      const cpfWithoutMask = removeCpfMask(input.cpf);
      const cnpjWithoutMask = removeCnpjMask(input.cnpj);
      const newRegister = {
        nome: input.nome,
        sobrenome: input.sobrenome,
        email: input.email,
        data_de_nascimento: input.data_de_nascimento,
        mochila: input.mochila,
        cpf: cpfWithoutMask,
        cnpj: cnpjWithoutMask,
        telefone: phoneWithoutMask,
        senha: hashedPassword,
        token_dispositivo: 'token-do-dispositivo',
        cidade: input.cidade,
      };
      const motoboy = await this.motoboyRepository.create(newRegister);
      return motoboy;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Registro já existe.', error);
      }
      throw new InternalServerErrorException(
        'Erro interno ao tentar realizar cadastro do Entregador.',
        error,
      );
    }
  }
}

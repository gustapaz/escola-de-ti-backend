import { LoginUseCase } from '../../auth/domain/service/login.use-case';
import { RegisterUseCase } from '../../auth/domain/service/register.use-case';
import { RegisterDto } from '../../auth/domain/dto/register.dto';

export class GenerateBearer {
  private motoboyData: RegisterDto = {
    nome: 'Silva',
    sobrenome: 'Kleber',
    cpf: '11111111111',
    cnpj: '11111111111111',
    email: 'test00040@gmail.com',
    telefone: '44999999999',
    data_de_nascimento: '01/01/2000',
    senha: '12345678',
    mochila: true,
    cidade: 'Maringá',
  };

  constructor(
    private readonly loginUseCase?: LoginUseCase,
    private readonly registerUseCase?: RegisterUseCase,
  ) {}

  public async createMotoboy() {
    if (!this.registerUseCase) {
      return;
    }
    const response = await this.registerUseCase.register(this.motoboyData);
    return response;
  }

  public async getJwtToken(
    emailSend?: string,
    passwordSend?: string,
    idSend?: string,
  ): Promise<any> {
    let createdMotoboy;
    if (!emailSend || !passwordSend || !idSend) {
      createdMotoboy = await this.createMotoboy();
    }

    const response = await this.loginUseCase.login({
      email: emailSend || this.motoboyData.email,
      senha: passwordSend || this.motoboyData.senha,
      id: idSend || createdMotoboy.id,
    });

    if (createdMotoboy && createdMotoboy.id) {
      return {
        access_token: response.access_token,
        id_resgister: createdMotoboy.id,
      };
    }

    return { access_token: response.access_token, id: idSend };
  }
}

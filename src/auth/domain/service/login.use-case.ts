import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { timingSafeEqual } from 'crypto';
import { hashPassword } from '../../utils/hash-password';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly motoboyRepository: MotoboyRepository,
  ) {}

  async login({ email, senha }: LoginDto) {
    try {
      const entregador = await this.validateEntregador(email, senha);

      const payload = { email: entregador.email, sub: entregador.id };
      const tokens = await this.generateToken(payload.sub, payload.email);
      await this.refreshTokenRepository.updateAccount(
        payload.sub,
        tokens.access_token,
        tokens.refresh_token,
      );
      return tokens;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao realizar login.', error);
    }
  }

  async generateToken(id: string, email: string) {
    try {
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: id,
            email,
          },
          {
            secret: this.configService.get<string>('KEY'),
            expiresIn: '4d',
          },
        ),
        this.jwtService.signAsync(
          {
            sub: id,
            email,
          },
          {
            secret: this.configService.get<string>('KEY'),
            expiresIn: '7d',
          },
        ),
      ]);
      return { access_token, refresh_token };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao gerar token para o email: ${email}`,
        error,
      );
    }
  }
  async validateEntregador(email: string, senha: string): Promise<LoginDto> {
    try {
      const entregador = await this.motoboyRepository.findByEmail(email);
      if (!entregador) {
        throw new NotFoundException('Entregador não encontrado.');
      }
      this.comparePassword(entregador.senha, senha);
      return entregador;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao validar entregador.',
        error,
      );
    }
  }

  private comparePassword(storedPassword: string, inputPassword: string) {
    if (!storedPassword.includes('.')) {
      throw new BadRequestException('Senha armazenada em formato inválido');
    }
    try {
      const [salt, hash] = storedPassword.split('.');
      const hashedInput = hashPassword(inputPassword, salt);
      const match = timingSafeEqual(
        Buffer.from(hashedInput.split('.')[1], 'hex'),
        Buffer.from(hash, 'hex'),
      );
      return match;
    } catch (error) {
      throw new UnauthorizedException('Erro ao comparar senhas.', error);
    }
  }
}

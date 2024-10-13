import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';
import { LoginUseCase } from './login.use-case';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly motoboyRepository: MotoboyRepository,
  ) {}

  async refreshToken(motoboyId: string, refreshToken: string) {
    const storedTokens = await this.refreshTokenRepository.getStoredTokens(
      motoboyId,
    );
    if (!storedTokens) {
      throw new NotFoundException('Token não encontrado');
    }
    try {
      const motoboy = await this.motoboyRepository.findById(motoboyId);

      const { access_token, refresh_token } =
        await this.loginUseCase.generateToken(motoboyId, motoboy.email);

      await this.refreshTokenRepository.updateAccount(
        motoboyId,
        access_token,
        refresh_token,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar token.', error);
    }
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfileDto } from '../dto/profile.dto';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';

@Injectable()
export class ProfileUseCase {
  constructor(private readonly motoboyRepository: MotoboyRepository) {}

  async profile(email: string): Promise<ProfileDto> {
    try {
      const fullProfile = await this.motoboyRepository.profile(email);
      return fullProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao recuperar perfil.',
        error,
      );
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUseCase } from './profile.use-case';
import { InternalServerErrorException } from '@nestjs/common';
import { MotoboyRepository } from '../../../motoboy/domain/repository/motoboy.repository';

describe('ProfileUseCase', () => {
  let profileUseCase: ProfileUseCase;
  let mockRepository: Partial<MotoboyRepository>;

  beforeEach(async () => {
    mockRepository = {
      profile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileUseCase,
        { provide: MotoboyRepository, useValue: mockRepository },
      ],
    }).compile();

    profileUseCase = module.get<ProfileUseCase>(ProfileUseCase);
  });

  it('should be defined', () => {
    expect(profileUseCase).toBeDefined();
  });

  it('should throw an InternalServerErrorException trying to get profile', async () => {
    const mockEmail = 'joao.almeida@example.com';
    (mockRepository.profile as jest.Mock).mockRejectedValueOnce(new Error());

    await expect(profileUseCase.profile(mockEmail)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should return a ProfileDto', async () => {
    const mockEmail = 'joao.almeida@example.com';
    const mockProfile = {
      nome: 'João',
      aiqcoins: 0,
    };
    (mockRepository.profile as jest.Mock).mockResolvedValueOnce(mockProfile);

    const profile = await profileUseCase.profile(mockEmail);

    expect(profile).toEqual(mockProfile);
  });
});

import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt-access.strategy';
import { RefreshTokenStrategy } from '../strategies/jwt-refresh.strategy';
import { RegisterUseCase } from '../domain/service/register.use-case';
import { LoginUseCase } from '../domain/service/login.use-case';
import { ProfileUseCase } from '../domain/service/profile.use-case';
import { SmsUseCase } from '../domain/service/sms.use-case';
import { RefreshTokenUseCase } from '../domain/service/refresh-token.use-case';
import { RefreshTokenRepository } from '../domain/repository/refresh-token.repository';
import { RefreshTokenRepositoryImpl } from '../data-access/infraestructure/repository/refresh-token.repository.impl';
import { MotoboyModule } from '../../motoboy/resource/motoboy.module';
@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    forwardRef(() => MotoboyModule),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RefreshTokenStrategy,
    RegisterUseCase,
    LoginUseCase,
    ProfileUseCase,
    SmsUseCase,
    RefreshTokenUseCase,
    {
      provide: RefreshTokenRepository,
      useClass: RefreshTokenRepositoryImpl,
    },
  ],
  exports: [SmsUseCase, RegisterUseCase, LoginUseCase]
})
export class AuthModule { }

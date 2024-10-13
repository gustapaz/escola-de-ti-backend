import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.KEY,
    });
  }

  async validate(payload: string) {
    if (!payload) {
      throw new UnauthorizedException('Token Invalido');
    }
    return payload;
  }
}

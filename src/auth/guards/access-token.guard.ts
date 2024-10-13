import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException('Token Invalido');
        }
        return user;
    }
}
import { BadRequestException, NotFoundException, UnauthorizedException, HttpException, ForbiddenException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { getErrorCodeForException } from './generate-error-code';

describe('generate-error-code', () => {
    it('should return 1000 when exception is not found', () => {
        const exception = new HttpException('Erro', 404);
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1000);
    });

    it('should return 1001 when BadRequestException is passed', () => {
        const exception = new BadRequestException('Bad Request');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1001);
    });

    it('should return 1002 when UnauthorizedException is passed', () => {
        const exception = new UnauthorizedException('Unauthorized');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1002);
    });

    it('should return 1003 when NotFoundException is passed', () => {
        const exception = new NotFoundException('Not Found');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1003);
    });

    it('should return 1004 when ForbiddenException is passed', () => {
        const exception = new ForbiddenException('Forbidden');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1004);
    });

    it('should return 1007 when ConflictException is passed', () => {
        const exception = new ConflictException('Conflict');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1007);
    });

    it('should return 1011 when InternalServerErrorException is passed', () => {
        const exception = new InternalServerErrorException('Internal Server Error');
        const errorCode = getErrorCodeForException(exception);
        expect(errorCode).toBe(1011);
    });
});

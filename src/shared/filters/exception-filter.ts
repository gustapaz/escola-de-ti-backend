import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { getErrorCodeForException } from '../utils/generate-error-code';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorCode = getErrorCodeForException(exception);

    let responseBody;
    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse() as Record<string, any>;
      responseBody = {
        error: true,
        list: request.body,
        code: errorCode,
        message: validationErrors.message,
      };
    } else {
      responseBody = {
        error: true,
        list: request.body,
        code: errorCode,
        message: exception.message,
      };
    }
    response.status(status).json(responseBody);
  }
}

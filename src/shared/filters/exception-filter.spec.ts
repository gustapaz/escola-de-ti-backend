import { HttpException, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filter';
import { getErrorCodeForException } from '../utils/generate-error-code';

jest.mock('../../shared/utils/generate-error-code');

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a generic HttpException', () => {
    const mockException = new HttpException('Test Exception', 500);
    const mockRequest = { body: { key: 'value' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    (getErrorCodeForException as jest.Mock).mockReturnValue('1011');

    filter.catch(mockException, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: true,
      list: mockRequest.body,
      code: '1011',
      message: 'Test Exception',
    });
  });

  it('should handle a BadRequestException with validation errors', () => {
    const mockException = new BadRequestException({
      message: 'Validation failed',
    });
    const mockRequest = { body: { key: 'value' } };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    (getErrorCodeForException as jest.Mock).mockReturnValue('1001');

    filter.catch(mockException, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: true,
      list: mockRequest.body,
      code: '1001',
      message: 'Validation failed',
    });
  });
});

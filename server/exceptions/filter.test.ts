import {
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionFilter } from './filter';
import {
  ValidationFailed,
  InvalidCredentials,
  GenericException,
  Unauthorized,
} from './index';

describe('ExceptionFilter', () => {
  let exceptionFilter: ExceptionFilter;
  let host: ArgumentsHost;
  let getResponseMock: jest.Mock;

  beforeEach(() => {
    exceptionFilter = new ExceptionFilter();
    host = {
      switchToHttp: jest.fn(() => ({
        getResponse: getResponseMock,
      })),
    } as any;
    getResponseMock = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('doNotReport', () => {
    it('should return an array of exceptions to not report', () => {
      const exceptions = exceptionFilter.doNotReport();
      expect(exceptions).toEqual([
        NotFoundException,
        ValidationFailed,
        InvalidCredentials,
        GenericException,
        Unauthorized,
        UnauthorizedException,
      ]);
    });
  });

  describe('catch', () => {
    it('should return validation failed exception', () => {
      const exception = new ValidationFailed({});
      const responseMock = { error: jest.fn() };
      getResponseMock.mockReturnValue(responseMock);

      exceptionFilter.catch(exception, host);

      expect(responseMock.error).toHaveBeenCalledWith(
        {
          message: exception.message,
          errors: exception.getErrors(),
        },
        exception.getStatus(),
      );
    });

    it('should return unauthorized exception', () => {
      const exception = new Unauthorized();
      const jsonMock = jest.fn();
      const responseMock = {
        error: jest.fn(),
        status: jest.fn(() => ({
          json: jsonMock,
        })),
      };
      getResponseMock.mockReturnValue(responseMock);

      exceptionFilter.catch(exception, host);
      expect(responseMock.status).toHaveBeenCalledWith(exception.getStatus());
      expect(jsonMock).toHaveBeenCalledWith({
        message: exception.message,
        code: exception.getStatus(),
        success: false,
      });
    });

    it('should return other exceptions as internal server error', () => {
      const exception = new Error('Something went wrong');
      const jsonMock = jest.fn();
      const responseMock = {
        error: jest.fn(),
        status: jest.fn(() => ({
          json: jsonMock,
        })),
      };
      getResponseMock.mockReturnValue(responseMock);

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        code: 500,
        message: 'Internal Server Error',
      });
    });

    it('should return the exception status and message if provided', () => {
      const exception = new Error('Custom error message');
      (exception as any).status = 400;
      const jsonMock = jest.fn();
      const responseMock = {
        error: jest.fn(),
        status: jest.fn(() => ({
          json: jsonMock,
        })),
      };
      getResponseMock.mockReturnValue(responseMock);

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        code: 400,
        message: exception.message,
      });
    });
  });
});

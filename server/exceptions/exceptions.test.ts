import {
  GenericException,
  InvalidCredentials,
  Unauthorized,
  ValidationFailed,
} from './index';

describe('Exceptions', () => {
  it('should create a new instance of a GenericExcpetion', () => {
    const exception = new GenericException('test');
    expect(exception).toBeInstanceOf(GenericException);
  });

  it('should create a new instance of a InvalidCredentials', () => {
    const exception = new InvalidCredentials();
    expect(exception).toBeInstanceOf(InvalidCredentials);
  });

  it('should create a new instance of a Unauthorized', () => {
    const exception = new Unauthorized();
    expect(exception).toBeInstanceOf(Unauthorized);
  });

  it('should create a new instance of a ValidationFailed', () => {
    const exception = new ValidationFailed({});
    expect(exception).toBeInstanceOf(ValidationFailed);
  });
});

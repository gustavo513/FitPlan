import { CustomError } from '../customError';

export class BadGatewayError extends CustomError {
  readonly statusCode = 502;

  constructor(public message: string) {
    super(message);
  }

  get errors() {
    return [{ message: this.message }];
  }

  serializeErrors() {
    return this.errors;
  }
}
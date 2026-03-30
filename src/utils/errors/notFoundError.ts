import { CustomError } from '../customError';

export class NotFoundError extends CustomError {
  readonly statusCode = 404;

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
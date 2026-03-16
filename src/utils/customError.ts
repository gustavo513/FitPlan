export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: { message: string; context?: { [key: string]: any } }[];

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  abstract serializeErrors(): { message: string; context?: { [key: string]: any } }[];
}
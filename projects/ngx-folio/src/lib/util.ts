import { ValidatorError } from './validator.service';

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

export function numbersRange(from: number, to: number): number[] {
  const range = [];
  for (let i = from; i <= to; i += 1) {
    range.push(i);
  }

  return range;
}

export function assert(comparison: boolean, message: string): asserts comparison {
  if (!comparison) {
    throw new AssertionError(message);
  }
}

export function checkValidationErrors(errors: ValidatorError[], message: string): asserts errors {
  if (errors.length > 0) {
    const errorMessages = errors.map((error) => error.message).join('\n');
    throw new ValidationError(`${message} \n${errorMessages}`);
  }
}

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AssertionError extends CustomError {}

export class ValidationError extends CustomError {}

import FastestValidator, { ValidationError, ValidationSchema } from 'fastest-validator';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  // TODO: replace fastest validator by own implementation
  private readonly fastest = new FastestValidator();

  validate(value: unknown, schema: ValidationSchema): { success: boolean; errors: ValidationError[] } {
    const result = this.fastest.validate(value, schema);

    return result === true ? { success: true, errors: [] } : { success: false, errors: result };
  }
}

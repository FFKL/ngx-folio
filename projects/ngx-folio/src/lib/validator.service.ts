import { Injectable } from '@angular/core';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
}

interface IntegerRule {
  type: 'integer';
  min?: number;
}

type ValidationRule = IntegerRule;

type ValidationSchema<T> = { [key in keyof T]?: ValidationRule };

type ValidateFunction = (fieldName: string, value: unknown, rule: ValidationRule) => ValidationResult;

function validateInteger(fieldName: string, value: unknown, { min }: IntegerRule): ValidationResult {
  const isInteger = (val: unknown): val is number => typeof val === 'number' && Number.isInteger(val);

  if (!isInteger(value)) {
    return { success: false, errors: [{ field: fieldName, message: `'${fieldName}' should be an integer value` }] };
  }

  if (min !== undefined && value < min) {
    return {
      success: false,
      errors: [{ field: fieldName, message: `'${fieldName}' value lower than min threshold: ${value}` }],
    };
  }

  return { success: true, errors: [] };
}

@Injectable({ providedIn: 'root' })
export class ValidatorService {
  private readonly validators: { [type: string]: ValidateFunction } = {
    integer: validateInteger,
  };

  validate<T extends { [key: string]: unknown }>(target: T, schema: ValidationSchema<T>): ValidationResult {
    const errors = Object.entries(schema)
      .map(
        ([fieldName, rule]) =>
          typeof target[fieldName] === 'number' && rule && this.validateByRule(fieldName, target[fieldName], rule)
      )
      .filter((result): result is ValidationResult => result !== undefined)
      .reduce<ValidationError[]>((acc, curr) => [...acc, ...curr.errors], []);

    return { errors, success: errors.length === 0 };
  }

  private validateByRule(fieldName: string, value: unknown, rule: ValidationRule): ValidationResult {
    const validatorFn = this.pickValidator(rule);

    return validatorFn(fieldName, value, rule);
  }

  private pickValidator({ type }: ValidationRule): ValidateFunction {
    return this.validators[type];
  }
}

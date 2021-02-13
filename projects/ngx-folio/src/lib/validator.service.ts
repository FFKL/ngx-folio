import { Injectable } from '@angular/core';

export interface ValidatorError {
  field: string;
  message: string;
}

interface ValidationResult {
  success: boolean;
  errors: ValidatorError[];
}

interface IntegerRule {
  type: 'integer';
  min?: number;
}

type ValidationRule = IntegerRule;

type SchemaTuple = [fieldName: string, rule: ValidationRule];

type ValidationSchema<T> = { [key in keyof T]?: ValidationRule };

type ValidateFunction<T extends ValidationRule> = (fieldName: string, value: unknown, rule: T) => ValidationResult;

interface Validators {
  integer: ValidateFunction<IntegerRule>;
}

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
  private readonly validators: Validators = {
    integer: validateInteger
  };

  validate<T extends { [key: string]: unknown }>(target: T, schema: ValidationSchema<T>): ValidationResult {
    const errors = Object.entries<ValidationRule | undefined>(schema)
      .filter((entity): entity is SchemaTuple => Boolean(typeof target[entity[0]] === 'number' && entity[1]))
      .map(([fieldName, rule]) => this.validateByRule(fieldName, target[fieldName], rule))
      .reduce<ValidatorError[]>((acc, curr) => [...acc, ...curr.errors], []);

    return { errors, success: errors.length === 0 };
  }

  private validateByRule(fieldName: string, value: unknown, rule: ValidationRule): ValidationResult {
    const validatorFn = this.pickValidator(rule);

    return validatorFn(fieldName, value, rule);
  }

  // tslint:disable-next-line:no-any
  private pickValidator({ type }: ValidationRule): ValidateFunction<any> {
    return this.validators[type];
  }
}

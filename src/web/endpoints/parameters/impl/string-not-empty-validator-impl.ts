import { ParameterValidator } from "../parameter-validator";

/**
 * Validator implementation for the HelloWorld example.
 */
export class StringNotEmptyValidatorImpl implements ParameterValidator<string> {

    validate(value: string): boolean {
        return value != null && value.trim().length > 0;
    }

    description(): string {
        return 'The value should not be null or empty and contain a string.';
    }
}
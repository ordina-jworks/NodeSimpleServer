import { ParameterValidator } from "../parameter-validator";

/**
 *
 */
export class NumberIsPositiveValidatorImpl implements ParameterValidator<number> {

    validate(value: number): boolean {
        //TODO: Implement!
        return true;
    }

    description(): string {
        return 'The value should be a number that is 0 or greater.';
    }
}
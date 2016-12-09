import {ParamValidator} from "../../parameters/paramvalidator";

export class HelloWorldValidatorImpl implements ParamValidator<string, null, null> {

    validate(value: string): boolean {
        return value != null && value.trim().length > 0;
    }

    description(): string {
        return 'The value should not be null or empty and contain a string.';
    }
}
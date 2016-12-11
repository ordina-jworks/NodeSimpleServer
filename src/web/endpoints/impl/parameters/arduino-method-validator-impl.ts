import {ParameterValidator} from "../../parameters/parameter-validator";

export class ArduinoMethodValidatorImpl implements ParameterValidator<string, null, null> {

    validate(value: string): boolean {
        let isNotEmpty: boolean = value != null && value.trim().length > 0;

        if(isNotEmpty) {
            if(value == 'SERIAL' || value == 'JOHNNY-FIVE') {
                return true;
            }
        }
        return false;
    }

    description(): string {
        return 'The value should not be null or empty and should contain either SERIAL or JOHNNY-FIVE';
    }
}
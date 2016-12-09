import {ParamValidator} from "./paramvalidator";

export class Parameter<T, P, Q> {

    public name: string                         = null;
    public description: string                  = null;
    public validator: ParamValidator<T, P, Q>   = null;

    private value: T | P | Q                    = null;

    constructor(name: string, description: string, validator: ParamValidator<T, P, Q>) {
        this.name = name;
        this.description = description;
        this.validator = validator;
    }

    public setValue = (value: T | P | Q): void => {
        this.value = value;
    };

    public getValue = (): T | P | Q => {
      return this.value;
    };

    public validate = (): boolean => {
        if(this.validator != null) {
            let result: boolean = this.validator.validate(this.value);

            if(result) {
                console.log('Validation for ' + this.name + ' succeeded!');
                return true;
            } else {
                console.log('Validation for ' + this.name + ' (value: ' + this.value + ') failed: ' + this.validator.description());
                return false;
            }
        }
        console.log('Validation for ' + this.name + ' not defined and thus not needed!');
        return true;
    };
}
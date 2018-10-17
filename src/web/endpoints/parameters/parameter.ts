import { ParameterValidator } from "./parameter-validator";

/**
 * Generic Parameter class.
 *
 * This class represents a parameter where the T generic parameters are the potential types for the parameter.
 */
export class Parameter<T> {

    public name: string = null;
    public description: string = null;
    public validator: ParameterValidator<T> = null;

    private value: T = null;

    /**
     * Constructor for Parameter.
     *
     * @param name The name of the parameter. This is the name that needs to be given in the url address bar.
     * @param description The description for this parameter.
     * @param validator The optional validator for this parameter.
     */
    constructor(name: string, description: string, validator?: ParameterValidator<T>) {
        this.name = name;
        this.description = description;
        this.validator = validator;
    }

    /**
     * Sets the value for the parameter.
     *
     * @param value The value to set, should be of any of the T type.
     */
    public setValue(value: T): void {
        this.value = value;
    };

    /**
     * Gets the value of the parameter.
     *
     * @returns {T} The value of the parameter, will be of the T type.
     */
    public getValue(): T {
        return this.value;
    };

    /**
     * Validates the parameter.
     * If the validator is null, no validation is performed and it is always considered as being valid.
     * If the validation is successful true is returned.
     * If the validation is unsuccessful false is returned.
     *
     * @returns {boolean} True if valid, false if not.
     */
    public validate(): boolean {
        if (this.validator != null) {
            let result: boolean = this.validator.validate(this.value);

            if (result) {
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
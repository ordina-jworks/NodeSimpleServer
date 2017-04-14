/**
 * Interface for all the ParameterValidator implementations.
 */
export interface ParameterValidator<T> {

    /**
     * Validates the parameter.
     *
     * @param value The value that should be validated.
     * @returns {boolean} True if valid, false if not.
     */
    validate(value: T): boolean;

    /**
     * Gets the description for the validator. This should describe the validation that is performed.
     *
     * @returns {string} The description of the validator.
     */
    description(): string;
}
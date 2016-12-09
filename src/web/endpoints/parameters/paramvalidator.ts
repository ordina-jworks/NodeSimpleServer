export interface ParamValidator<T , P , Q> {

    validate(value: T | P | Q): boolean;

    description(): string;
}
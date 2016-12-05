export interface ParamValidator {

    validate(value: any): boolean;

    description(): string;
}
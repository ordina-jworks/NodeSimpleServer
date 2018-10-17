import { Parameter } from "./parameters/parameter";

/**
 * Base class for and endpoint implementations.
 */
export abstract class BaseEndpoint {

    /**
     * Maps the entry points for this endpoint.
     * This method should be called from the constructor!
     */
    public abstract mapEntryPoints: Function;

    /**
     * Gets the parameter by name. Checks the array of available parameters, if a name match is found, that match is returned.
     * If no match is found, null is returned.
     *
     * @param {string} parameterName The name of the parameter to find.
     * @param {Array<Parameter<any>>} parameters The array of the available parameters.
     * @returns {Parameter<any>} The matching parameter if found, null if not.
     */
    public getParameterByName(parameterName: string, parameters: Array<Parameter<any>>): Parameter<any> {
        for (let i: number = 0; i < parameters.length; i++) {
            let parameter: Parameter<any> = parameters[i];

            if (parameter.name == parameterName) {
                return parameter;
            }
        }
        return null;
    }
}
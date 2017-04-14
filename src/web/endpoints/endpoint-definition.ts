import {Parameter} from "./parameters/parameter";

/**
 * Generic EndpointDefinition class.
 *
 * This class represents an Endpoint where the T generic parameter is the type for the parameter.
 * If you do not need any parameters you can pass null to all of the generic parameters.
 */
export class EndpointDefinition<T> {

    public path: string                     = null;
    public description: string              = null;
    public parameters: Array<Parameter<T>>  = null;

    private executor: Function              = null;

    /**
     * Constructor for Endpoint.
     *
     * @param path The path of the endpoint.
     * @param executor The executor function that will be executed when the endpoint is executed.
     * @param parameters An array containing the parameters with the provided generic types.
     */
    constructor(path: string, executor: Function, parameters?: Array<Parameter<T>>) {
        this.path = path;
        this.executor = executor;
        this.parameters = parameters ? parameters : [];
    }

    /**
     * Executes the endpoint by calling the executor function.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public execute = (request, response): void => {
        this.executor(request, response, this.parameters);
    }
}
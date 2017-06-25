import {Parameter} from "./parameters/parameter";
import {HttpMethod} from "../http-method";

/**
 * Generic EndpointDefinition class.
 *
 * This class represents an Endpoint where the T generic parameter is the type for the parameter.
 * If you do not need any parameters you can pass null to all of the generic parameters.
 */
export class EndpointDefinition {

    public path: string                         = null;
    public method: HttpMethod                   = null;
    public description: string                  = null;
    public parameters: Array<Parameter<any>>    = null;

    private executor: Function                  = null;

    /**
     * Constructor for Endpoint.
     * Defaults to the GET HTTP method if no specific method is given!
     *
     * @param path The path of the endpoint.
     * @param executor The executor function that will be executed when the endpoint is executed.
     * @param parameters An array containing the parameters with the provided generic types.
     * @param method The HTTP method that this definition should be used for. Defaults to the GET method if not specified.
     */
    constructor(path: string, executor: Function, parameters: Array<Parameter<any>> = [], method: HttpMethod = HttpMethod.GET) {
        this.path = path;
        this.method = method;
        this.executor = executor;
        this.parameters = parameters;
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
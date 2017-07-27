import {Parameter}                          from "./parameters/parameter";
import {HttpMethod}                         from "../http-method";
import {IncomingMessage, ServerResponse}    from "http";

/**
 * Generic EndpointDefinition class.
 *
 * This class represents an Endpoint where the T generic parameter is the type for the parameter.
 * If you do not need any parameters you can pass null to all of the generic parameters.
 */
export class EndpointDefinition {

    public path: string                         = null;
    public method: HttpMethod                   = null;
    public parameters: Array<Parameter<any>>    = null;

    public requiresAuthentication: boolean      = false;
    public roles: string[]                      = [];

    private executor: Function                  = null;

    /**
     * Constructor for Endpoint.
     * Defaults to the GET HTTP method if no specific method is given!
     *
     * @param path The path of the endpoint.
     * @param executor The executor function that will be executed when the endpoint is executed.
     * @param parameters An array containing the parameters with the provided generic types.
     * @param method The HTTP method that this definition should be used for. Defaults to the GET method if not specified.
     * @param requiresAuthentication Boolean that is should be true if the endpoint requires authentication, false or not provided if not!
     * @param roles Array of string items that represent the roles that are granted to access the endpoint (authenticated).
     */
    constructor(path: string, executor: Function, parameters: Array<Parameter<any>> = [], method: HttpMethod = HttpMethod.GET, requiresAuthentication: boolean = false, roles: string[] = []) {
        this.path = path;
        this.method = method;
        this.executor = executor;
        this.parameters = parameters;
        this.requiresAuthentication = requiresAuthentication;
        this.roles = roles;
    }

    /**
     * Executes the endpoint by calling the executor function.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public execute = (request: IncomingMessage, response: ServerResponse): void => {
        this.executor(request, response, this.parameters);
    };

    /**
     * Executes the endpoint by calling the executor function, while also passing along the body.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param {{}} body The JSON object that contains the payload of the body.
     */
    public executeWithBodyPayload = (request: IncomingMessage, response: ServerResponse, body: {}): void => {
        this.executor(request, response, body);
    };
}
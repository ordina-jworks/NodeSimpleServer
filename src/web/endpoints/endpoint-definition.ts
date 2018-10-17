import { Parameter } from "./parameters/parameter";
import { HttpMethod } from "../http-method";
import { IncomingMessage, ServerResponse } from "http";

/**
 * Generic EndpointDefinition class.
 *
 * This class represents an Endpoint where the T generic parameter is the type for the parameter.
 * If you do not need any parameters you can pass null to all of the generic parameters.
 */
export class EndpointDefinition {

    public path: string = null;
    public method: HttpMethod = null;
    public parameters: Array<Parameter<any>> = [];

    public requiresAuthentication: boolean = false;
    public roles: string[] = [];

    public executor: Function = null;

    /**
     * Please use the builder class to make new instances!
     */
    public constructor() {
        //Empty constructor!
    }

    /**
     * Executes the endpoint by calling the executor function.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public execute(request: IncomingMessage, response: ServerResponse): void {
        this.executor(request, response, this.parameters);
    };

    /**
     * Executes the endpoint by calling the executor function, while also passing along the body.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param {{}} body The JSON object that contains the payload of the body.
     */
    public executeWithBodyPayload(request: IncomingMessage, response: ServerResponse, body: {}): void {
        this.executor(request, response, body);
    };
}
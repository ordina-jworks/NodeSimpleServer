import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {IncomingMessage, ServerResponse}    from "http";

export abstract class HttpMethodEndpointHandler {

    public abstract handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void;
}
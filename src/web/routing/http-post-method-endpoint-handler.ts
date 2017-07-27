import * as url                             from "url";
import {IncomingMessage, ServerResponse}    from "http";

import {Router}                             from "./router";
import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {HttpMethodEndpointHandler}          from "./base-http-method-endpoint-handler";

export class HttpPostMethodEndpointHandler extends HttpMethodEndpointHandler {

    /**
     * This method will try and execute the requested endpoint.
     * If the Endpoint requires parameters, the number of parameters will be validated and a 400 error will ge generated.
     * If the number of parameters is correct, the parameter validator for the endpoint will be called to validate the parameters.
     * If the validation of the parameters fails a 400 error will be generated.
     *
     * @param endPoint The Endpoint to execute.
     * @param pathName The path of the requested endpoint.
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void {
        let requestData: any = url.parse(request.url, true);

        if(requestData.query && Object.keys(requestData.query).length > 0) {
            Router.displayError(response, 500, 'A post request should not contain any query params!', pathName);
            return;
        }

        let error: {code: number, message: string} = this.parseUrlParams(pathName, endPoint);
        if(!error) {
            endPoint.execute(request, response);
            return;
        } else {
            Router.displayError(response, error.code, error.message, pathName);
            return;
        }

        //TODO: The actual data that is needed is in the request body and should ideally also be validated!
    }
}
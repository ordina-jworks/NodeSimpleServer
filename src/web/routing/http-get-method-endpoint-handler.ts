import * as url                             from "url";
import {Url}                                from "url";
import {IncomingMessage, ServerResponse}    from "http";

import {Router}                             from "./router";
import {HttpMethodEndpointHandler}          from "./base-http-method-endpoint-handler";
import {EndpointDefinition}                 from "../endpoints/endpoint-definition";

export class HttpGetMethodEndpointHandler extends HttpMethodEndpointHandler {

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
        let requestData: Url = url.parse(request.url, true);

        if(requestData.query.length == 0) {
            endPoint.execute(request, response);
        } else {
            let result: {code: number, message: string};

            result = this.parseQueryParams(requestData, endPoint);
            if(!result) {
                endPoint.execute(request, response);
                return;
            } else {
                if(result.code != 200) {
                    Router.displayError(response, result.code, result.message, pathName);
                    return;
                }
            }

            result = this.parseUrlParams(pathName, endPoint);
            if(!result) {
                endPoint.execute(request, response);
                return;
            } else {
                Router.displayError(response, result.code, result.message, pathName);
                return;
            }
        }
    }
}
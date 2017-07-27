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
            Router.respondSpecificServerError(response, 500, 'A post request should not contain any query params!', pathName);
            return;
        }

        let result: {code: number, message: string} = this.parseUrlParams(pathName, endPoint);
        if(!result) {
            endPoint.execute(request, response);
            return;
        } else {
            if(result.code != 200) {
                Router.respondSpecificServerError(response, result.code, result.message, pathName);
                return;
            }
        }

        this.parseBodyPayload(request,(result: {code: number, message: string, data: any}) => {
            if(result.code == 200) {
                endPoint.executeWithBodyPayload(request, response, result.data);
                return;
            } else {
                Router.respondServerError(response, 'Cannot parse request body! Make sure that it is proper JSON!', false, 'text/plain');
                return;
            }
        });
    }
}
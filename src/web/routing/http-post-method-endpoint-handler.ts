import * as url                             from "url";
import {IncomingMessage, ServerResponse}    from "http";

import {Router}                             from "./router";
import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {HttpMethodEndpointHandler}          from "./base-http-method-endpoint-handler";

export class HttpPostMethodEndpointHandler extends HttpMethodEndpointHandler {

    public handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void {
        let requestData: any = url.parse(request.url, true);
        if(requestData.query && Object.keys(requestData.query).length > 0) {
            Router.displayError(response, 500, 'A post request should not contain any query params!', pathName);
            return;
        }

        let error: {code: number, message: string} = this.handleUrlParams(pathName, endPoint);
        if(!error) {
            endPoint.execute(request, response);
        } else {
            Router.displayError(response, error.code, error.message, pathName);
        }

        //TODO: The actual data that is needed is in the request body and should ideally also be validated!
    }
}
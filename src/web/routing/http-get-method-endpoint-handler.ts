import {URL} from 'url';
import {IncomingMessage, ServerResponse} from 'http';

import {Router} from './router';
import {HttpMethodEndpointHandler, HttpReturn} from './base-http-method-endpoint-handler';
import {EndpointDefinition} from '../endpoints/endpoint-definition';

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
        let parsedUrl: URL = new URL(request.url, 'http://' + request.headers.host);
        let queryParams: Array<any> = Array.from(parsedUrl.searchParams);

        //TODO: Check for RESTFUL PARAMS!

        if(queryParams == null || queryParams.length == 0) {
            endPoint.execute(request, response);
        } else {
            let result: HttpReturn;

            result = this.parseQueryParams(parsedUrl, endPoint);
            if(!result) {
                endPoint.execute(request, response);
                return;
            } else {
                if(result.code != 200) {
                    Router.respondSpecificServerError(response, result.code, result.message, pathName);
                    return;
                }
            }

            result = this.parseUrlParams(pathName, endPoint);
            if(!result) {
                endPoint.execute(request, response);
                return;
            } else {
                if(result.code != 200) {
                    Router.respondSpecificServerError(response, result.code, result.message, pathName);
                    return;
                } else {
                    endPoint.execute(request, response);
                    return;
                }
            }
        }
    }
}
import {HttpMethodEndpointHandler}          from "./http-method-endpoint-handler";
import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {IncomingMessage, ServerResponse}    from "http";
import * as url                             from "url";
import {Parameter}                          from "../endpoints/parameters/parameter";
import {Router}                             from "./router";

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
        let requestData: any = url.parse(request.url, true);

        if(requestData.query.length == 0) {
            endPoint.execute(request, response);
        } else {
            let urlParams: Array<any> = requestData.query;

            //Handle query params
            if(urlParams && Object.keys(urlParams).length > 0) {
                if(endPoint.parameters.length === Object.keys(urlParams).length) {
                    for (let i = 0; i < endPoint.parameters.length; i++) {
                        let param: Parameter<any> = endPoint.parameters[i];
                        param.setValue(urlParams[endPoint.parameters[i].name]);

                        if (!param.validate()) {
                            Router.displayError(response, 400, 'Validation failed: ' + param.validator.description(), pathName);
                            return;
                        }
                    }
                    endPoint.execute(request, response);
                } else {
                    Router.displayError(response, 400, 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters), pathName);
                }
                return;
            }

            //Handle restful URL params
            if(pathName.split('/').length == endPoint.path.split('/').length) {
                let pathAndParams: string[] = pathName.split('/');
                let endpointPath: string[] = endPoint.path.split('/');

                let params: {} = {};
                for(let i: number = 0; i < pathAndParams.length; i++) {
                    if(pathAndParams[i] != endpointPath[i]) {
                        console.log('Param found in url: '+ endpointPath[i] + ' with value: ' + pathAndParams[i]);
                        params[endpointPath[i].substring(1, endpointPath[i].length - 1)] = pathAndParams[i];
                    }
                }

                if(endPoint.parameters.length == Object.keys(params).length) {
                    for (let i = 0; i < endPoint.parameters.length; i++) {
                        let param: Parameter<any> = endPoint.parameters[i];
                        param.setValue(params[endPoint.parameters[i].name]);

                        if (!param.validate()) {
                            Router.displayError(response, 400, 'Validation failed: ' + param.validator.description(), pathName);
                            return;
                        }
                    }
                    endPoint.execute(request, response);
                } else {
                    Router.displayError(response, 400, 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters), pathName);
                    return;
                }
            } else {
                Router.displayError(response, 400, 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters), pathName);
            }
        }
    }
}
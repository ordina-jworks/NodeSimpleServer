import {HttpMethodEndpointHandler}          from "./http-method-endpoint-handler";
import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {IncomingMessage, ServerResponse}    from "http";
import {Parameter}                          from "../endpoints/parameters/parameter";
import {Router}                             from "./router";

export class HttpPostMethodEndpointHandler extends HttpMethodEndpointHandler {

    public handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void {
        //TODO: The actual data that is needed is in the request body and should ideally also be validated!

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
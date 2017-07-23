import {IncomingMessage, ServerResponse}    from "http";

import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {Parameter}                          from "../endpoints/parameters/parameter";

export abstract class HttpMethodEndpointHandler {

    public abstract handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void;

    public handleUrlParams(pathName: string, endPoint: EndpointDefinition): { code: number, message: string } {
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
                        return {
                            code: 400,
                            message: 'Validation failed: ' + param.validator.description()
                        };
                    }
                }
                return null;
            } else {
                return {
                    code: 400,
                    message: 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters)
                };
            }
        } else {
            return {
                code: 400,
                message: 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters)
            };
        }
    }
}
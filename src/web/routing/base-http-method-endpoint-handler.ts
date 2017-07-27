import {Url}                                from "url";
import {IncomingMessage, ServerResponse}    from "http";

import {EndpointDefinition}                 from "../endpoints/endpoint-definition";
import {Parameter}                          from "../endpoints/parameters/parameter";

export abstract class HttpMethodEndpointHandler {

    public abstract handleEndpoint(endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void;

    /**
     * This method will try and parse the restful URL parameters.
     * If the parsing succeeds, null is returned. If not, and result object containing the code and message is returned.
     * This result contains the code and message that should be returned to the requestor.
     *
     * @param {string} pathName The pathName of on which the request is made.
     * @param {EndpointDefinition} endPoint The endPoint which has been matched on the pathName.
     * @returns {{code: number; message: string}} The result is parsing failed or null if not.
     */
    public parseUrlParams(pathName: string, endPoint: EndpointDefinition): { code: number, message: string } {
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

    /**
     * This method will try and parse the query URL parameters.
     * If the parsing succeeds, null is returned. If not, and result object containing the code and message is returned.
     * This result contains the code and message that should be returned to the requestor.
     *
     * @param {"url".Url} requestData The data of the request, which contains the url query parameters.
     * @param {EndpointDefinition} endPoint The endPoint that was matched for this request.
     * @returns {{code: number; message: string}} The result is parsing failed or no params are found or null if not.
     */
    public parseQueryParams(requestData: Url, endPoint: EndpointDefinition): { code: number, message: string} {
        let urlParams: Array<any> = requestData.query;

        if(urlParams && Object.keys(urlParams).length > 0) {
            if(endPoint.parameters.length === Object.keys(urlParams).length) {
                for (let i = 0; i < endPoint.parameters.length; i++) {
                    let param: Parameter<any> = endPoint.parameters[i];
                    param.setValue(urlParams[endPoint.parameters[i].name]);

                    if (!param.validate()) {
                        return {
                            code: 400,
                            message: 'Validation failed: ' + param.validator.description()
                        }
                    }
                }
                return null;
            } else {
                return {
                    code: 400,
                    message: 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters)
                }
            }
        }
        return {
            code: 200,
            message: 'No Query params to process!'
        };
    }
}
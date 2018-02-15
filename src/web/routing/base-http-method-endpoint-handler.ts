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
     * @returns {HttpReturn} The result is parsing failed or null if not.
     */
    public parseUrlParams(pathName: string, endPoint: EndpointDefinition): HttpReturn {
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
                if(endPoint.parameters.length == 0) {
                    return {
                        code: 200,
                        message: 'OK'
                    };
                }

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
     * @returns {HttpReturn} The result is parsing failed or no params are found or null if not.
     */
    public parseQueryParams(requestData: URL, endPoint: EndpointDefinition): HttpReturn {
        let queryParams: Array<any> = Array.from(requestData.searchParams);

        if(queryParams && queryParams.length > 0) {
            if(endPoint.parameters.length === queryParams.length) {
                for (let i = 0; i < endPoint.parameters.length; i++) {
                    let param: Parameter<any> = endPoint.parameters[i];

                    for (let keyValuePair of queryParams) {
                        if(keyValuePair[0] === endPoint.parameters[i].name) {
                            param.setValue(keyValuePair[1]);
                        }
                    }

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

    /**
     * This method will try and parse the body of the request. This should contain the actual data/payload!
     *
     * @param {"http".IncomingMessage} request The request on which we receive the data.
     * @param {Function} callback The callback function to execute when the full payload has been processed!
     */
    public parseBodyPayload(request: IncomingMessage, callback: Function): void {
        let result: HttpReturn = null;
        let fullBody: string = '';

        request.on('data', (chunk) => {
            fullBody += chunk.toString();
        });

        request.on('end', () => {
            try {
                result = {
                    code: 200,
                    message: 'OK',
                    data: JSON.parse(fullBody)
                }
            } catch (error) {
                result = {
                    code: 500,
                    message: 'Cannot parse request body! Make sure that it is proper JSON!',
                    data: null
                }
            }

            callback(result);
        });
    }
}

export type HttpReturn = {
    code: number,
    message: string,
    data?: any
}
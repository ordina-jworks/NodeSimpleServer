import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}          from "../parameters/parameter";
import {EndPointManager}    from "../endpoint-manager";
import {EndPointDefinition}           from "../endpoint-definition";
import {BaseEndpoint} from "./base-endpoint";

/**
 * Class containing the generic and application default endpoints.
 * All methods in this class should be static and no state should be kept!
 */
export class GenericEndpoints extends BaseEndpoint {

    /**
     * Constructor for the GenericEndpoints class.
     */
    constructor() {
        super();
    }

    /**
     * Endpoint handler that reroutes to the index page of the welcome application.
     * This allows the root / endpoint to point to the web page, so index.html can be omitted.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public index(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>): void {
        console.log('index endpoint called!');

        super.redirect(response, '/welcome/index.html');
    }

    /**
     * Endpoint handler that generates a list of all registered endpoints.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public listEndpoints(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>): void {
        console.log('listEndpoints endpoint called!');

        let manager: EndPointManager = EndPointManager.getInstance();
        let endpoints: Array<EndPointDefinition<any, any, any>> = manager.getEndpoints();

        let list:Array<{}> = [];
        for (let endpoint of endpoints) {

            let params = [];
            for(let parameter of endpoint.parameters) {
                let paramDesc: {} = {};
                paramDesc['name'] = parameter.name;
                paramDesc['desc'] = parameter.description;
                paramDesc['valid'] = parameter.validator.description();
                params.push(paramDesc);
            }

            let endpointDesc: {} = {};
            endpointDesc['path'] = endpoint.path;
            endpointDesc['params'] = params;
            list.push(endpointDesc);
        }

        super.respondOK(response, list);
    }

    /**
     * Endpoint handler for an example hello world. This takes a simple name parameter and generates a welcome message with the given name.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public helloworld(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>): void {
        console.log('helloworld endpoint called!');

        super.respondOK(
            response,
            'Hello World! Hello there ' + params[0].getValue() + '!',
            false
        );
    }
}
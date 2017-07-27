import * as fs from "fs";

import {Stats}              from "fs";
import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}                      from "../parameters/parameter";
import {EndpointManager}                from "../endpoint-manager";
import {EndpointDefinition}             from "../endpoint-definition";
import {BaseEndpoint}                   from "../base-endpoint";
import {MessageManager}                 from "../../../ipc/message-manager";
import {IPCMessage}                     from "../../../ipc/messages/ipc-message";
import {MessageTarget}                  from "../../../ipc/message-target";
import {DataBrokerOperation}            from "../../../workers/impl/databroker/data-broker-operation";
import {StringNotEmptyValidatorImpl}    from "../parameters/impl/string-not-empty-validator-impl";
import {NumberIsPositiveValidatorImpl}  from "../parameters/impl/number_is_positive_validator_impl";
import {Config}                         from "../../../../resources/config";
import {Router}                         from "../../routing/router";

/**
 * Class containing the generic and application default endpoints.
 * All methods in this class should be static and no state should be kept!
 */
export class GenericEndpoints extends BaseEndpoint {

    private config: Config              = null;
    private webContentFolder: string    = null;

    /**
     * Constructor for the GenericEndpoints class.
     */
    constructor() {
        super();

        this.mapEntryPoints();
        this.config = Config.getInstance();

        this.webContentFolder = this.config.settings.webContentFolder;
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/',
                this.index.bind(this)
            )
        );

        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/endpoints',
                this.listEndpoints.bind(this)
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/apps',
                this.listWebapps.bind(this)
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/helloworld',
                this.helloworld.bind(this),
                [new Parameter<string>('name', 'string field containing the name', new StringNotEmptyValidatorImpl())]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/helloworld/{name}',
                this.helloworld.bind(this),
                [new Parameter<string>('name', 'string field containing the name', new StringNotEmptyValidatorImpl())]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/caches',
                this.listCaches.bind(this)
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/cache',
                this.listCacheContent.bind(this),
                [new Parameter<string>('name', 'string field containing the name of the cache')]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/cache/{name}',
                this.listCacheContent.bind(this),
                [new Parameter<string>('name', 'string field containing the name of the cache')]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/cache/{name}/worker/{id}',
                this.listCacheContentForWorker.bind(this),
                [
                    new Parameter<string>('name', 'string field containing the name of the cache', new StringNotEmptyValidatorImpl()),
                    new Parameter<number>('id', 'number field containing the worker id for which to display all items in the cache', new NumberIsPositiveValidatorImpl())
                ]
            )
        );
    };

    /**
     * Endpoint handler that reroutes to the index page of the welcome application.
     * This allows the root / endpoint to point to the web page, so index.html can be omitted.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public index = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('index endpoint called!');

        Router.redirect(response, '/welcome/index.html');
    };

    /**
     * Endpoint handler that generates a list of all registered endpoints.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public listEndpoints = (request: IncomingMessage, response: ServerResponse, params: [Parameter<any>]): void => {
        console.log('listEndpoints endpoint called!');

        let manager: EndpointManager = EndpointManager.getInstance();
        let endpoints: Array<EndpointDefinition> = manager.getEndpoints();

        let list:Array<{}> = [];
        for (let endpoint of endpoints) {

            let params = [];
            for(let parameter of endpoint.parameters) {
                let paramDesc: {} = {};
                paramDesc['name'] = parameter.name;
                paramDesc['desc'] = parameter.description;
                if(parameter.validator) {
                    paramDesc['valid'] = parameter.validator.description();
                }
                params.push(paramDesc);
            }

            let endpointDesc: {} = {};
            endpointDesc['path'] = endpoint.path;
            endpointDesc['params'] = params;
            list.push(endpointDesc);
        }

        Router.respondOK(response, list);
    };

    /**
     * Endpoint handler that generates a list of available webapps.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public listWebapps = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('listWebapps endpoint called!');

        let apps: string[] = [];
        let items: string[] = fs.readdirSync(this.webContentFolder);
        items.forEach((item: string) => {
            let stats: Stats = fs.statSync(this.webContentFolder + '/' + item);
            if(stats.isDirectory() && item.search('bower_components') == -1) {
                apps.push(this.webContentFolder + '/' + item);
            }
        });

        Router.respondOK(response, {apps: apps});
    };

    /**
     * Endpoint handler for an example hello world. This takes a simple name parameter and generates a welcome message with the given name.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public helloworld = (request: IncomingMessage, response: ServerResponse, params: [Parameter<string>]): void => {
        console.log('helloworld endpoint called!');

        Router.respondOK(response, 'Hello World!\n\nHello there ' + params[0].getValue() + '!', false);
    };

    /**
     *
     * @param request
     * @param response
     */
    public listCaches = (request: IncomingMessage, response: ServerResponse) :void => {
        console.log('listCaches endpoint called!');

        MessageManager.getInstance().sendMessageWithCallback(null, (message: IPCMessage): void => {

            console.log('listCaches callback called!');
            Router.respondOK(response, message.payload);

        }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE_CACHES + "");
    };

    /**
     *
     * @param request
     * @param response
     * @param params
     */
    public listCacheContent = (request: IncomingMessage, response: ServerResponse, params: [Parameter<string>]): void => {
        console.log('listCacheContent endpoint called!');

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : params[0].getValue()}, (message: IPCMessage): void => {

            console.log('listCacheContent callback called! ' + JSON.stringify(message));
            Router.respondOK(response, message.payload);

        }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE_CACHE + "");
    };

    /**
     *
     * @param request
     * @param response
     * @param params
     */
    public listCacheContentForWorker = (request: IncomingMessage, response: ServerResponse, params: [Parameter<any>]) => {
        //TODO: Implement correct functionality!
        Router.respondServerError(response, {error: 'Functionality not implemented!', parameters: params});
    };
}
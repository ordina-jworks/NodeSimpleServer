import http     = require('http');
import url      = require('url');

import {Router}                     from './router';
import {EndPointDefinition}                   from "./endpoints/endpoint-definition";
import {Config}                     from '../../resources/config';

import {IncomingMessage}            from "http";
import {ServerResponse}             from "http";

import {GenericEndpoints}           from "./endpoints/impl/generic-endpoints";
import {EndPointManager}            from "./endpoints/endpoint-manager";
import {Parameter}                  from "./endpoints/parameters/parameter";
import {HelloWorldValidatorImpl}    from "./endpoints/impl/parameters/hello-world-param-validator-impl";
import {ArduinoEndpoint}            from "./endpoints/impl/arduino-endpoint";
import {ArduinoMethodValidatorImpl} from "./endpoints/impl/parameters/arduino-method-validator-impl";
import {MessageManager} from "../ipc/message-manager";
import {MessageTarget} from "../ipc/message-target";
import {DataBrokerOperation} from "../workers/impl/databroker/data-broker-operation";

/**
 * Server class.
 *
 * This class is instantiated for each HTTP_WORKER.
 * It registers the endpoints and handles HTTP requests.
 * The HTTP requests are passed on to the Router instance.
 */
export class Server {

    private config: Config                      = null;
    private endpointManager: EndPointManager    = null;
    private messageManager: MessageManager      = null;

    private id: string                          = null;
    private router: Router                      = null;

    /**
     * Constructor for Server.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: string) {
        this.id = workerId;
        this.config = Config.getInstance();
        this.endpointManager = EndPointManager.getInstance();
        this.messageManager = MessageManager.getInstance();

        this.mapRestEndpoints();
        this.router = new Router();

        let port: number = this.config.settings.httpPort;
        //Create a http server that listens on the given port. the second param is for making the localhost loopback work.
        http.createServer(this.onRequest).listen(port, '0.0.0.0');
        console.log('[WORKER id:' + workerId + '] Server started => Listening at port: ' + port);
    }

    /**
     * Maps the default endpoints.
     * Endpoints can always be added at any other location and point in time.
     * This can be done by getting the instance of the EndPointManager and calling the registerEndpoint method.
     *
     * It is recommended you create an instance of each wanted endpoint, and use that to get the Function instances to tie to the EndPointDefinition.
     * Be sure to use the bind() method on the function and pass the specific endpoint instance to it. Otherwise the context will not be correct!
     */
    private mapRestEndpoints = (): void => {
        let genericEndpoints: GenericEndpoints  = new GenericEndpoints();
        let arduinoEndpoint: ArduinoEndpoint    = new ArduinoEndpoint();

        //Generic endpoints
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/',
                genericEndpoints.index.bind(genericEndpoints),
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/slotmachine',
                genericEndpoints.slotmachineIndex.bind(genericEndpoints),
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/booze',
                genericEndpoints.boozeIndex.bind(genericEndpoints),
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/endpoints',
                genericEndpoints.listEndpoints.bind(genericEndpoints),
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/helloworld',
                genericEndpoints.helloworld.bind(genericEndpoints),
                [new Parameter<string, null, null>('name', 'string field containing the name', new HelloWorldValidatorImpl())]
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/caches',
                genericEndpoints.listCaches.bind(genericEndpoints),
                [new Parameter<string, null, null>('name', 'string field containing the name of the cache', null)]
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/cache',
                genericEndpoints.listCacheContent.bind(genericEndpoints),
                [new Parameter<string, null, null>('name', 'string field containing the name of the cache', null)]
            )
        );

        //Arduino endpoints
        this.endpointManager.registerEndpoint(
            new EndPointDefinition(
                '/arduino/setArduinoMethod',
                arduinoEndpoint.setArduinoMethod.bind(arduinoEndpoint),
                [new Parameter<string, null, null>('method', 'string field that contains the method used for adruino implementations', new ArduinoMethodValidatorImpl())]
            )
        );
    };

    /**
     * Handler method for HTTP requests.
     * Is called for each HTTP request that has been received and assigned to this HTTPWorker/Server instance.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    private onRequest = (request: IncomingMessage, response: ServerResponse): void => {
        let pathName: string = url.parse(request.url).pathname;

        let requestLine: string = '[WORKER id:' + this.id + '] IP: ' + request.connection.remoteAddress + ' \t-> requested: ' + pathName;
        console.log(requestLine);
        this.messageManager.sendMessage({
            'cacheName' : 'requests',
            'key' : new Date().getTime() + '-' + this.id + '-' + request.connection.remoteAddress,
            'value' : requestLine
        }, MessageTarget.DATA_BROKER, DataBrokerOperation.SAVE + "");

        this.router.route(pathName, request, response);
    };
}
import http     = require('http');
import url      = require('url');

import {Router}                     from './router';
import {EndPoint}                   from "./endpoints/endpoint";
import {Config}                     from '../../resources/config';

import {IncomingMessage}            from "http";
import {ServerResponse}             from "http";

import {GenericEndpoints}           from "./endpoints/impl/generic-endpoints";
import {EndPointManager}            from "./endpoints/endpoint-manager";
import {Parameter}                  from "./endpoints/parameters/parameter";
import {HelloWorldValidatorImpl}    from "./endpoints/impl/parameters/hello-world-param-validator-impl";
import {ArduinoEndpoint}            from "./endpoints/impl/arduino-endpoint";
import {ArduinoMethodValidatorImpl} from "./endpoints/impl/parameters/arduino-method-validator-impl";
import {MySenseHelmetEndpoint} from "./endpoints/impl/mysense-helmet-endpoint";

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

        this.mapRestEndpoints();
        this.router = new Router();

        let port: number = this.config.settings.httpPort;
        //Create a http server that listens on the given port. the second param is for making the localhost loopback work.
        http.createServer(this.onRequest).listen(port, '0.0.0.0');
        console.log('[id:' + this.id + '] Server started => Listening at port: ' + port);
    }

    /**
     * Maps the default endpoints.
     * Endpoints can always be added at any other location and point in time.
     * This can be done by getting the instance of the EndPointManager and calling the registerEndpoint method.
     */
    private mapRestEndpoints = (): void => {
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/',
                GenericEndpoints.index,
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/endpoints',
                GenericEndpoints.listEndpoints,
                null
            )
        );
        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/helloworld',
                GenericEndpoints.helloworld,
                [new Parameter<string, null, null>('name', 'string field containing the name', new HelloWorldValidatorImpl())]
            )
        );

        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/arduino/setArduinoMethod',
                ArduinoEndpoint.setArduinoMethod,
                [new Parameter<string, null, null>('method', 'string field that contains the method used for adruino implementations', new ArduinoMethodValidatorImpl())]
            )
        );

        this.endpointManager.registerEndpoint(
            new EndPoint(
                '/pxm',
                MySenseHelmetEndpoint.sendPushNotification,
                null
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
        console.log('IP: ' + request.connection.remoteAddress + ' \tassigned to server: ' + this.id + '\t-> requested: ' + pathName);

        this.router.route(pathName, request, response);
    };
}
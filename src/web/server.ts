import http     = require('http');
import url      = require('url');

import {Router}     from './router';
import {EndPoint}   from "./endpoints/endpoint";
import {Config}     from '../../resources/config';

import {IncomingMessage}            from "http";
import {ServerResponse}             from "http";

import {GenericEndpoints}           from "./endpoints/impl/genericendpoints";
import {EndPointManager}            from "./endpoints/endpointmanager";
import {Parameter}                  from "./endpoints/parameters/parameter";
import {HelloWorldValidatorImpl}    from "./endpoints/impl/parameters/helloworldparamvalidatorimpl";
import {ArduinoEndpoint} from "./endpoints/impl/arduinoendpoint";
import {ArduinoMethodValidatorImpl} from "./endpoints/impl/parameters/arduinomethodvalidatorimpl";

export class Server {

    private config: Config  = Config.getInstance();

    private id: string                          = null;
    private router: Router                      = null;
    private endpointManager: EndPointManager    = null;

    constructor(workerId: string) {
        this.id = workerId;

        this.mapRestEndpoints();
        this.router = new Router();

        let port: number = this.config.settings.httpPort;
        //Create a http server that listens on the given port. the second param is for making the localhost loopback work.
        http.createServer(this.onRequest).listen(port, '0.0.0.0');
        console.log('[id:' + this.id + '] Server started => Listening at port: ' + port);
    }

    private mapRestEndpoints = (): void => {
        this.endpointManager = EndPointManager.getInstance();
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
    };

    private onRequest = (request: IncomingMessage, response: ServerResponse): void => {
        let pathName: string = url.parse(request.url).pathname;
        console.log('IP: ' + request.connection.remoteAddress + ' \tassigned to server: ' + this.id + '\t-> requested: ' + pathName);

        this.router.route(pathName, request, response);
    };
}
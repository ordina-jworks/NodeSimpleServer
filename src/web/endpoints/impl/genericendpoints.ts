import {Parameter}          from "../parameters/parameter";
import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";
import {EndPointManager}    from "../endpointmanager";
import {EndPoint}           from "../endpoint";

export class GenericEndpoints {

    public static index(request: IncomingMessage, response: ServerResponse, params: Array<Parameter>): void {
        console.log('index endpoint called!');

        response.writeHead(301, {
            "Location" : "/welcome/index.html"
        });
        response.end();
    }

    public static listEndpoints(request: IncomingMessage, response: ServerResponse, params: Array<Parameter>): void {
        console.log('listEndpoints endpoint called!');

        let manager: EndPointManager = EndPointManager.getInstance();
        let endpoints: Array<EndPoint> = manager.getEndpoints();

        let list:Array<{}> = [];
        for (let endpoint of endpoints) {
            list.push(
                {
                    path:   endpoint.path,
                    params: endpoint.parameters
                }
            );
        }

        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(JSON.stringify(list, null, 4));
        response.end();
    }

    public static helloworld(request: IncomingMessage, response: ServerResponse, params: Array<Parameter>): void {
        console.log('helloworld endpoint called!');

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World! Hello there ' + params[0].getValue() + '!');
        response.end();
    }
}
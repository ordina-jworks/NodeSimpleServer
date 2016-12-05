import {Parameter}          from "../parameters/parameter";
import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

export class GenericEndpoints {

    public static index(request: IncomingMessage, response: ServerResponse, params: Array<Parameter>): void {
        console.log('index endpoint called!');

        response.writeHead(301, {
            "Location" : "/welcome/index.html"
        });
        response.end();
    }

    public static helloworld(request: IncomingMessage, response: ServerResponse, params: Array<Parameter>): void {
        console.log('helloworld endpoint called!');

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World! Hello there ' + params[0].getValue() + '!');
        response.end();
    }
}
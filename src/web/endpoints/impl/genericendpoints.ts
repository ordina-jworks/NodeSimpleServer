import {Parameter}          from "../parameters/parameter";
import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";
import {EndPointManager}    from "../endpointmanager";
import {EndPoint}           from "../endpoint";

export class GenericEndpoints {

    public static index(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>): void {
        console.log('index endpoint called!');

        response.writeHead(301, {
            "Location" : "/welcome/index.html"
        });
        response.end();
    }

    public static listEndpoints(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>): void {
        console.log('listEndpoints endpoint called!');

        let manager: EndPointManager = EndPointManager.getInstance();
        let endpoints: Array<EndPoint<any, any, any>> = manager.getEndpoints();

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

        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(JSON.stringify(list, null, 4));
        response.end();
    }

    public static helloworld(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>): void {
        console.log('helloworld endpoint called!');

        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World! Hello there ' + params[0].getValue() + '!');
        response.end();
    }
}
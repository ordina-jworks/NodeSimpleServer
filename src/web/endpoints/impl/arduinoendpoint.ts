import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}          from "../parameters/parameter";
import {Config}             from "../../../../resources/config";
import {MessageManager}     from "../../../ipc/messagemanager";
import {IPCMessage}         from "../../../ipc/ipc-message";
import {MessageTarget}      from "../../../ipc/message-target";

export class ArduinoEndpoint {

    private static config: Config = Config.getInstance();

    public static setArduinoMethod(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean, null, null>>) {
        console.log('setArduinoMethod endpoint called!');

        ArduinoEndpoint.config.arduino.useSerialOverJohnnyFive = params[0].getValue();

        MessageManager.getInstance().sendMessageWithCallback(null, (message: IPCMessage): void => {
           console.log('Callback called!');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Arduino method has been set!');
            response.end();
        }, MessageTarget.INTERVAL_WORKER, 'restartArduino');
    }

    public static getArduinoImplementations(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>) {
        console.log('getArduinoImplementations endpoint called!');

        //TODO: Implement!
    }

    public static setArduinoImplementation(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>) {
        console.log('setArduinoImplementation endpoint called!');

        //TODO: Implement!
        //TODO: Only allow this to be called from the localhost!
    }
}
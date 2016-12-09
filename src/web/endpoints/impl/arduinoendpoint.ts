import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}          from "../parameters/parameter";
import {Config}             from "../../../../resources/config";
import {MessageManager}     from "../../../ipc/messagemanager";
import {IPCMessage}         from "../../../ipc/ipcmessage";
import {MessageTarget}      from "../../../ipc/message-target";

export class ArduinoEndpoint {

    private static config: Config = Config.getInstance();

    public static setArduinoMethod(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean, null, null>>) {
        console.log('setArduinoMethod endpoint called!');

        ArduinoEndpoint.config.arduino.useSerialOverJohnnyFive = params[0].getValue();

        //TODO: Send a message to the intervalworker, it then should restart the arduino functionality with the new parameters!

        MessageManager.getInstance().sendMessageWithCallback(null, (message: IPCMessage): void => {
           console.log('Callback called!');
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
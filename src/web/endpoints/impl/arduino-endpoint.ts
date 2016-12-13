import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}          from "../parameters/parameter";
import {Config}             from "../../../../resources/config";
import {MessageManager}     from "../../../ipc/message-manager";
import {IPCMessage}         from "../../../ipc/messages/ipc-message";
import {MessageTarget}      from "../../../ipc/message-target";

/**
 * Class containing the Arduino endpoints.
 * All methods in this class should be static and no state should be kept!
 */
export class ArduinoEndpoint {

    private static config: Config = Config.getInstance();

    /**
     * Endpoint handler for setting the method used to communicate with the Arduino. This will restart the Arduino logic.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public static setArduinoMethod(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean, null, null>>): void {
        console.log('setArduinoMethod endpoint called!');

        ArduinoEndpoint.config.arduino.useSerialOverJohnnyFive = params[0].getValue();

        MessageManager.getInstance().sendMessageWithCallback(null, (message: IPCMessage): void => {
           console.log('Callback called!');
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.write('Arduino method has been set!');
            response.end();
        }, MessageTarget.INTERVAL_WORKER, 'restart');
    }

    /**
     * Endpoint handler for generating a list of al available Arduino scenarios listed per method.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public static getArduinoScenarios(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>): void {
        console.log('getArduinoImplementations endpoint called!');

        //TODO: Implement!
    }

    /**
     * Endpoint handler for setting a scenario for the Arduino. This will restart the Arduino logic.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public static setArduinoScenario(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>): void {
        console.log('setArduinoImplementation endpoint called!');

        //TODO: Implement!
        //TODO: Only allow this to be called from the localhost!
    }
}
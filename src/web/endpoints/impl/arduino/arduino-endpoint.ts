import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Parameter}                  from "../../parameters/parameter";
import {Config}                     from "../../../../../resources/config";
import {MessageManager}             from "../../../../ipc/message-manager";
import {IPCMessage}                 from "../../../../ipc/messages/ipc-message";
import {MessageTarget}              from "../../../../ipc/message-target";
import {BaseEndpoint}               from "../../base-endpoint";
import {EndpointManager}            from "../../endpoint-manager";
import {EndpointDefinition}         from "../../endpoint-definition";
import {ArduinoMethodValidatorImpl} from "../../parameters/impl/arduino-method-validator-impl";
import {Router}                     from "../../../routing/router";

/**
 * Class containing the Arduino endpoints.
 * No state should be kept in this class!
 */
export class ArduinoEndpoint extends BaseEndpoint {

    private config: Config = Config.getInstance();

    /**
     * Constructor for the ArduinoEndpoint class.
     */
    constructor() {
        super();

        this.mapEntryPoints();
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/arduino',
                this.index.bind(this)
            )
        );

        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/arduino/setArduinoMethod',
                this.setArduinoMethod.bind(this),
                [new Parameter<string>('method', 'string field that contains the method used for arduino implementations', new ArduinoMethodValidatorImpl())]
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

        Router.redirect(response, '/arduino/index.html');
    };

    /**
     * Endpoint handler for setting the method used to communicate with the Arduino. This will restart the Arduino logic.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public setArduinoMethod = (request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean>>): void => {
        console.log('setArduinoMethod endpoint called!');

        this.config.arduino.useSerialOverJohnnyFive = params[0].getValue();

        MessageManager.getInstance().sendMessageWithCallback(null, (message: IPCMessage): void => {

            console.log('setArduinoMethod callback called!');
            Router.respondOK(response, 'Arduino method has been set!', false, 'text/plain');

        }, MessageTarget.INTERVAL_WORKER, 'restart');
    };

    /**
     * Endpoint handler for generating a list of al available Arduino scenarios listed per method.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public getArduinoScenarios = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('getArduinoImplementations endpoint called!');

        //TODO: Implement!
        Router.respondServerError(response, 'Functionality not implemented yet!', false, 'text/plain');
    };

    /**
     * Endpoint handler for setting a scenario for the Arduino. This will restart the Arduino logic.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public setArduinoScenario = (request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string>>): void => {
        console.log('setArduinoImplementation endpoint called!');

        //TODO: Implement!
        //TODO: Only allow this to be called from the localhost!
        Router.respondServerError(response, 'Functionality not implemented yet!', false, 'text/plain');
    };
}
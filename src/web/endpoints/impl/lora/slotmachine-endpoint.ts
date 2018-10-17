import { BaseEndpoint } from "../../base-endpoint";
import { IncomingMessage, ServerResponse } from "http";
import { MessageManager } from "../../../../ipc/message-manager";
import { MessageTarget } from "../../../../ipc/message-target";
import { EndpointManager } from "../../endpoint-manager";
import { Router } from "../../../routing/router";
import { EndpointBuilder } from "../../endpoint-builder";

/**
 * Class containing the Slotmachine endpoints.
 * No state should be kept in this class.
 */
export class SlotmachineEndpoint extends BaseEndpoint {

    private messageManager: MessageManager;

    /**
     * Constructor for SlotmachineEndpoint.
     */
    constructor() {
        super();

        this.messageManager = MessageManager.getInstance();
        this.mapEntryPoints();
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        let builder: EndpointBuilder = new EndpointBuilder();

        endpointManager
            .registerEndpoint(
                builder
                    .path('/slotmachine')
                    .executor(this.slotmachineIndex.bind(this))
                    .build()
            )
            .registerEndpoint(
                builder
                    .path('/slotmachine/click')
                    .executor(this.fakeClick.bind(this))
                    .build()
            )
            .registerEndpoint(
                builder
                    .path('/slotmachine/buttonTrigger')
                    .executor(this.buttonTrigger.bind(this))
                    .build()
            )
    };

    /**
     * Endpoint handler that reroutes to the index page of the slotmachine application.
     * This allow the /slotmachine endpoint to point to the web page, so index.html can be omitted.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public slotmachineIndex(request: IncomingMessage, response: ServerResponse): void {
        console.log('slotmachine index endpoint called!');

        Router.redirect(response, '/slotmachine/index.html');
    };

    /**
     * Can be used to dispatch a fake click event on the webs ocket.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    private fakeClick(request: IncomingMessage, response: ServerResponse): void {
        this.messageManager.sendMessage({ buttonPressed: true }, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        Router.respondOK(response, 'Fake click dispatched', false, 'text/plain');
    };

    /**
     * Executed when the slotmachine LoRa button is pressed.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param body The payload body of the request. This contains the actual data!
     */
    public buttonTrigger(request: IncomingMessage, response: ServerResponse, body: any): void {
        console.log('Request received for buttonTrigger...');

        switch (request.method) {
            case 'GET':
                Router.respondOK(response, 'To use this service, post JSON data to it!', false, 'text/plain');
                break;
            case 'POST':
                this.handleButtonTrigger(response, body);
                break;
        }
    };

    /**
     * Callback handler when the payload has been received and parsed.
     *
     * @param response
     * @param data The payload data in JSON form.
     */
    private handleButtonTrigger(response: ServerResponse, data: { payload: any }): void {
        let error: string = null;

        if (data) {
            if (data.payload == true || data.payload == 'true' || data.payload == 1) {
                this.messageManager.sendMessage({ buttonPressed: true }, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
            } else if (data.payload == false || data.payload == 'false' || data.payload == 0) {
                this.messageManager.sendMessage({ buttonPressed: false }, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
            }
        } else {
            error = 'No valid data received to process for buttonTrigger!';
            console.error(error);
        }

        if (!error) {
            Router.respondOK(response, null);
        } else {
            Router.respondServerError(response, error, false, 'text/plain');
        }
    };
}
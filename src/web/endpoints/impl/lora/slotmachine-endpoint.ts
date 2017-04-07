import {BaseEndpoint}                       from "../../base-endpoint";
import {IncomingMessage, ServerResponse}    from "http";
import {MessageManager}                     from "../../../../ipc/message-manager";
import {MessageTarget}                      from "../../../../ipc/message-target";
import {EndpointManager}                    from "../../endpoint-manager";
import {EndpointDefinition}                 from "../../endpoint-definition";

/**
 * Class containing the Slotmachine endpoints.
 * No state should be kept in this class.
 */
export class SlotmachineEndpoint extends BaseEndpoint {

    private messageManager: MessageManager;

    /**
     * Constructor for SlotmachineEndpoint.
     */
    constructor () {
        super();

        this.messageManager = MessageManager.getInstance();
        this.mapEntryPoints();
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/slotmachine/click',
                this.fakeClick.bind(this)
            )
        );

        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/pxm/buttonTrigger',
                this.buttonTrigger.bind(this)
            )
        );
    };

    /**
     * Can be used to dispatch a fake click event on the webs ocket.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    private fakeClick = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({buttonPressed: true}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Fake click dispatched', false, 'text/plain');
    };

    /**
     * Executed when the slotmachine LoRa button is pressed.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public buttonTrigger = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('Request received for buttonTrigger...');

        switch (request.method) {
            case 'GET':
                super.respondOK(response, 'To use this service, post JSON data to it!', false, 'text/plain');
                break;
            case 'POST':
                super.parsePayload(request, response, this.handleButtonTrigger);
                break;
        }
    };

    /**
     * Callback handler when the payload has been received and parsed.
     *
     * @param data The payload data in JSON form.
     */
    private handleButtonTrigger = (data: any): void => {
        switch (data.macaddress) {
            case '1C8779C00000003E':
            case '1C8779C00000003F':
                this.messageManager.sendMessage({buttonPressed: true}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            default:
                if(data.payload == true || data.payload == 'true' || data.payload == 1) {
                    this.messageManager.sendMessage({buttonPressed: true}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                } else if(data.payload == false || data.payload == 'false' || data.payload == 0) {
                    this.messageManager.sendMessage({buttonPressed: false}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                }
        }
    };
}
import {IncomingMessage, ServerResponse}    from 'http';

import {BaseEndpoint}                       from '../../base-endpoint';
import {MessageManager}                     from "../../../../ipc/message-manager";
import {MessageTarget}                      from "../../../../ipc/message-target";
import {EndpointManager}                    from "../../endpoint-manager";
import {EndpointDefinition}                 from "../../endpoint-definition";
import {Parameter}                          from "../../parameters/parameter";

/**
 * Class containing the Booze endpoints.
 * No state should be kept in this class.
 */
export class BoozeEndpoint extends BaseEndpoint {

    private messageManager: MessageManager;

    /**
     * Constructor for BoozeEndpoint.
     */
    constructor() {
        super();

        this.messageManager = MessageManager.getInstance();
        this.mapEntryPoints();
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelFull',
                this.levelFull.bind(this),
                null
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelHigh',
                this.levelHigh.bind(this),
                null
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelMedium',
                this.levelMedium.bind(this),
                null
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelLow',
                this.levelLow.bind(this),
                null
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelEmpty',
                this.levelEmpty.bind(this),
                null
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/booze/levelExact',
                this.levelExact.bind(this),
                [new Parameter<number, null, null>('level', 'number field containing the exact level of the booze meter.', null)]
            )
        );
    };

    public levelTrigger = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('Request received for levelTrigger...');

        switch (request.method) {
            case 'GET':
                super.respondOK(response, 'To use this service, post JSON data to it!', false, 'text/plain');
                break;
            case 'POST':
                super.parsePayload(request, response, this.handleLevelTrigger);
                break;
        }
    };

    public levelFull = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'FULL'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to FULL', false, 'text/plain');
    };

    public levelHigh = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'HIGH'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to HIGH', false, 'text/plain');
    };

    public levelMedium = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'MEDIUM'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to MEDIUM', false, 'text/plain');
    };

    public levelLow = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'LOW'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to LOW', false, 'text/plain');
    };

    public levelEmpty = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'EMPTY'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to EMPTY', false, 'text/plain');
    };

    public levelExact = (request: IncomingMessage, response: ServerResponse, params: [Parameter<number, null, null>]): void => {
        this.messageManager.sendMessage({level: params[0].getValue()}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        super.respondOK(response, 'Level set to ' + params[0].getValue() + '%', false, 'text/plain');
    };

    private handleLevelTrigger = (data: any): void => {
        switch (data.macaddress) {
            case '020000FFFF00B0B6':
                this.messageManager.sendMessage({level: 'FULL'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            case '020000FFFF00B0B8':
                this.messageManager.sendMessage({level: 'HIGH'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            case '020000FFFF00B0C9':
                this.messageManager.sendMessage({level: 'MEDIUM'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            case '020000FFFF00B0AC':
                this.messageManager.sendMessage({level: 'LOW'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            case '1C8779C00000003E':
            case '1C8779C00000003F':
                let level: string = 'LOW';
                //Since it are floats we are comparing (001/011/111) are the only numbers we should receive.
                //Low is below 2, medium is greater than 2, high is greater than 20.
                if(data.payload > 2) {
                    level = 'MEDIUM';
                }
                if(data.payload > 20) {
                    level = 'HIGH';
                }
                this.messageManager.sendMessage({level: level}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
                break;
            default:
                console.error('Unknown hardware id for sensor! Cannot map to level value!');
                break;
        }
    };
}
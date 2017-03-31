import {BaseEndpoint}                       from '../base-endpoint';
import {IncomingMessage, ServerResponse}    from 'http';
import {MessageManager}                     from "../../../../ipc/message-manager";
import {MessageTarget}                      from "../../../../ipc/message-target";

/**
 * Class containing the Booze endpoints.
 * No state should be kept in this class.
 */
export class BoozeEndPoint extends BaseEndpoint {

    private messageManager: MessageManager;

    /**
     * Constructor for BoozeEndPoint.
     */
    constructor() {
        super();

        this.messageManager = MessageManager.getInstance();
    }

    public levelTrigger = (request: IncomingMessage, response: ServerResponse): void => {
        console.log('Request received for levelTrigger...');

        switch (request.method) {
            case 'GET':
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('To use this service, post JSON data to it!');
                response.end();
                break;
            case 'POST':
                super.parsePayload(request, response, this.handleLevelTrigger);
                break;
        }
    };

    public levelFull = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'FULL'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to FULL');
        response.end();
    };

    public levelHigh = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'HIGH'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to HIGH');
        response.end();
    };

    public levelMedium = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'MEDIUM'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to MEDIUM');
        response.end();
    };

    public levelLow = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'LOW'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to LOW');
        response.end();
    };

    public levelEmpty = (request: IncomingMessage, response: ServerResponse): void => {
        this.messageManager.sendMessage({level: 'EMPTY'}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to EMPTY');
        response.end();
    };

    public levelExact = (request: IncomingMessage, response: ServerResponse, params: any): void => {
        //messageFactory.sendSimpleMessage(messageFactory.TARGET_INTERVAL_WORKER, 'broadcastMessage', {level: params.level});
        this.messageManager.sendMessage({level: params.level}, MessageTarget.INTERVAL_WORKER, 'broadcastMessage');
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Level set to ' + params.level + '%');
        response.end();
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
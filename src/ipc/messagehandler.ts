import cluster          = require('cluster');

import {IPCMessage}     from "./ipc-message";
import {MessageTarget}  from "./message-target";
import {EventEmitter}   from "events";
import {IPCRequest}     from "./ipc-request";
import {MessageManager} from "./messagemanager";
import {IPCReply}       from "./ipc-reply";

export class MessageHandler {

    private static instance: MessageHandler         = null;

    //Variables:
    private dataBroker : cluster.Worker             = null;
    private intervalWorker : cluster.Worker         = null;
    private httpWorkers : Array<cluster.Worker>     = null;

    public emitter: EventEmitter                   = null;

    private constructor() {

    }

    public static getInstance(): MessageHandler {
        if(!MessageHandler.instance) {
            MessageHandler.instance = new MessageHandler();
        }
        return MessageHandler.instance;
    }

    public initForMaster = (dataBroker: cluster.Worker, intervalWorker: cluster.Worker, httpWorkers: Array<cluster.Worker>): void => {
        this.dataBroker     = dataBroker;
        this.intervalWorker = intervalWorker;
        this.httpWorkers    = httpWorkers;

        this.emitter        = new EventEmitter();
    };

    public initForSlave = (): void => {
        this.emitter        = new EventEmitter();
    };

    /******************************************************************************************************************
    *******************************************************************************************************************
    *                                            MASTER MESSAGE HANDLERS                                              *
    *******************************************************************************************************************
    ******************************************************************************************************************/
    public onServerWorkerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from server worker');
        this.targetHandler(msg);
    };

    public onIntervalWorkerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from interval worker');
        this.targetHandler(msg);
    };

    public onDataBrokerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from data broker');
        cluster.workers[msg.workerId].send(msg);
    };

    private targetHandler = (msg: IPCMessage) => {
        //console.log(JSON.stringify(msg, null, 4));

        if(msg.type == IPCMessage.TYPE_REQUEST) {
            let m: IPCRequest = <IPCRequest> msg;
            console.log('Master received request');

            switch (m.target){
                case MessageTarget.DATA_BROKER:
                    this.dataBroker.send(msg);
                    break;
                case MessageTarget.INTERVAL_WORKER:
                    this.intervalWorker.send(msg);
                    break;
                case MessageTarget.HTTP_WORKER:
                    let index: number = Math.round(Math.random() * this.httpWorkers.length) - 1;
                    index = index === -1 ? 0 : index;
                    this.httpWorkers[index].send(msg);
                    break;
                default:
                    console.error('Cannot find message target: ' + m.target);
            }

        } else if(msg.type == IPCMessage.TYPE_REPLY) {
            let m: IPCReply = <IPCReply>msg;
            console.log('Master received reply!');

            cluster.workers[m.originalMessage.workerId].send(msg);
        }
    };

    /*******************************************************************************************************************
     *******************************************************************************************************************
     *                                            SLAVE MESSAGE HANDLING                                               *
     *******************************************************************************************************************
     *******************************************************************************************************************/
    public onMessageFromMasterReceived = (msg: IPCMessage): void => {

        if(msg.type == IPCMessage.TYPE_REQUEST) {
            let m: IPCRequest = <IPCRequest>msg;

            console.log('[id:' + cluster.worker.id  + '] Received request from master: routing to: ' + MessageTarget[m.target] + '.' + m.targetFunctionName);
            this.emitter.emit(MessageTarget[m.target] + '', m);

        } else if(msg.type == IPCMessage.TYPE_REPLY) {
            let m: IPCReply = <IPCReply>msg;
            console.log('Slave received reply!');

            MessageManager.getInstance().executeCallbackForId(m.originalMessage.callbackId);
        }
    };
}
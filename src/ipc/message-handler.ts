import cluster          = require('cluster');

import {IPCMessage}     from "./messages/ipc-message";
import {MessageTarget}  from "./message-target";
import {EventEmitter}   from "events";
import {IPCRequest}     from "./messages/ipc-request";
import {MessageManager} from "./message-manager";
import {IPCReply}       from "./messages/ipc-reply";

/**
 * MessageHandler singleton class.
 *
 * This singleton can be used to handle IPC messages.
 */
export class MessageHandler {

    private static instance: MessageHandler         = null;
    private dataBroker : cluster.Worker             = null;
    private intervalWorker : cluster.Worker         = null;
    private httpWorkers : Array<cluster.Worker>     = null;
    public emitter: EventEmitter                    = null;

    /**
     * Private constructor for the singleton.
     */
    private constructor() {

    }

    /**
     * Use this method to get the instance of this singleton class.
     *
     * @returns {MessageHandler} The instance of this singleton class.
     */
    public static getInstance(): MessageHandler {
        if(!MessageHandler.instance) {
            MessageHandler.instance = new MessageHandler();
        }
        return MessageHandler.instance;
    }

    /**
     * Initialises the MessageHandler for being a handler for the master NodeJS process.
     *
     * @param dataBroker The DataBroker worker instance.
     * @param intervalWorker The IntervalWorker worker instance.
     * @param httpWorkers The HTTPWorker worker instance.
     */
    public initForMaster = (dataBroker: cluster.Worker, intervalWorker: cluster.Worker, httpWorkers: Array<cluster.Worker>): void => {
        this.dataBroker     = dataBroker;
        this.intervalWorker = intervalWorker;
        this.httpWorkers    = httpWorkers;

        this.emitter        = new EventEmitter();
    };

    /**
     * Initialises the MessageHandler for being a handler for a slave (worker) NodeJS process.
     */
    public initForSlave = (): void => {
        this.emitter        = new EventEmitter();
    };

    /*-----------------------------------------------------------------------------
     ------------------------------------------------------------------------------
     --                         MASTER MESSAGE HANDLING                          --
     ------------------------------------------------------------------------------
     ----------------------------------------------------------------------------*/
    //TODO: Separate master and slave message handling?

    /**
     * Handler function for messages sent by HTTPWorkers.
     * Forwards the message to the target.
     *
     * @param msg The IPCMessage as sent by an HTTPWorker.
     */
    public onServerWorkerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from server worker');
        this.targetHandler(msg);
    };

    /**
     * Handler function for the messages sent by the IntervalWorker.
     * Forwards the message to the target.
     *
     * @param msg The IPCMessage as sent by the IntervalWorker.
     */
    public onIntervalWorkerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from interval worker');
        this.targetHandler(msg);
    };

    /**
     * Handler function for the messages sent by the DataBroker.
     * Forwards the message to the target.
     *
     * @param msg The IPCMessage as sent by the DataBroker.
     */
    public onDataBrokerMessageReceived = (msg: IPCMessage): void => {
        console.log('Message received from data broker');
        cluster.workers[msg.workerId].send(msg);
    };

    /**
     * This method is used to direct the IPCMessage to the correct target as specified in the message.
     * This handler makes a distinction between messages of the types IPCRequest and IPCReply.
     *
     * @param msg The IPCMessage that is to be forwarded to the correct target.
     */
    private targetHandler = (msg: IPCMessage) => {
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

    /*-----------------------------------------------------------------------------
     ------------------------------------------------------------------------------
     --                          SLAVE MESSAGE HANDLING                          --
     ------------------------------------------------------------------------------
     ----------------------------------------------------------------------------*/

    /**
     * Handler function for the messages sent by the Master NodeJS process.
     * This handler makes a distinction between messages of the types IPCRequest and IPCReply.
     *
     * @param msg The IPCMessage as passed on by the master process.
     */
    public onMessageFromMasterReceived = (msg: IPCMessage): void => {
        if(msg.type == IPCMessage.TYPE_REQUEST) {
            let m: IPCRequest = <IPCRequest>msg;

            console.log('[id:' + cluster.worker.id  + '] Received request from master: routing to: ' + MessageTarget[m.target] + '.' + m.targetFunction);
            this.emitter.emit(MessageTarget[m.target] + '', m);

        } else if(msg.type == IPCMessage.TYPE_REPLY) {
            let m: IPCReply = <IPCReply>msg;
            console.log('Slave received reply!');

            MessageManager.getInstance().executeCallbackForId(m.originalMessage.callbackId);
        }
    };
}
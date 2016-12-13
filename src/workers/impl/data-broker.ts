import {NodeWorker}     from '../node-worker';
import {IPCMessage}     from "../../ipc/messages/ipc-message";
import {MessageTarget}  from "../../ipc/message-target";
import {MessageHandler} from "../../ipc/message-handler";

/**
 * DataBroker class.
 *
 * This worker is used to perform data operations.
 */
export class DataBroker implements NodeWorker {

    workerId: string        = null;
    handler: MessageHandler = null;

    /**
     * Constructor for the DataBroker.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: string) {
        this.workerId = workerId;

        this.handler = MessageHandler.getInstance();
        this.handler.emitter.on(MessageTarget[MessageTarget.DATA_BROKER] + '', this.onMessage);

        console.log('[id:' + workerId + '] DataBroker created');
    }

    /**
     * Starts the DataBroker instance.
     */
    public start(): void {
        console.log('DataBroker starting...');

        //TODO: Implement!
    }

    /**
     * Handler for IPC messages. This method is called when an IPCMessage is received from any other worker.
     *
     * @param message The IPCMessage that is received. Can be of subtypes IPCRequest or IPCReply.
     */
    public onMessage(message: IPCMessage): void {
        console.log('Databroker message received');

        //TODO: Handle messages!
    }
}
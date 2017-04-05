import {NodeWorker}     from '../node-worker';
import {Server}         from "../../web/server";
import {IPCMessage}     from "../../ipc/messages/ipc-message";
import {MessageHandler} from "../../ipc/message-handler";
import {MessageTarget}  from "../../ipc/message-target";

/**
 * HTTPWorker class.
 *
 * This worker is used to handle web based requests for files and web services.
 */
export class HttpWorker implements NodeWorker {

    workerId: string            = null;
    handler: MessageHandler     = null;

    private server: Server      = null;

    /**
     * Constructor for the HTTPWorker.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: string) {
        this.workerId = workerId;

        this.handler = MessageHandler.getInstance();
        this.handler.emitter.on(MessageTarget[MessageTarget.HTTP_WORKER] + '', this.onMessage);

        console.log('[WORKER id:' + workerId + '] HttpWorker created');
        this.start();
    }

    /**
     * Starts the HTTPWorker instance.
     * Creates a new server on the shared port and allows it to handle requests.
     */
    public start (): void {
        console.log('[WORKER id:' + this.workerId + '] HttpWorker starting...');
        this.server = new Server(this.workerId);
    }

    /**
     * Handler for IPC messages. This method is called when an IPCMessage is received from any other worker.
     *
     * @param message The IPCMessage that is received. Can be of subtypes IPCRequest or IPCReply.
     */
    public onMessage (message: IPCMessage): void {
        console.log('[WORKER id:' + this.workerId + '] Message received');

        //TODO: Is this needed? Handle messages!
    }
}
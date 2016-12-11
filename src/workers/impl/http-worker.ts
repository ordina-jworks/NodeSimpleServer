import {NodeWorker} from '../node-worker';
import {Server}     from "../../web/server";
import {IPCMessage} from "../../ipc/ipc-message";
import {MessageHandler} from "../../ipc/message-handler";
import {MessageTarget} from "../../ipc/message-target";

export class HttpWorker implements NodeWorker {

    workerId: string;

    private server: Server              = null;
    private handler: MessageHandler     = MessageHandler.getInstance();

    constructor(workerId: string) {
        this.workerId = workerId;
        this.handler.emitter.on(MessageTarget[MessageTarget.HTTP_WORKER] + '', this.onMessage);

        console.log('[id:' + workerId + '] HttpWorker created');
        this.start();
    }

    public start = (): void => {
        console.log('[id:' + this.workerId + '] HttpWorker starting...');
        this.server = new Server(this.workerId);
    };

    public onMessage = (message: IPCMessage): void => {
        console.log('HTTPWorker message received');
    };
}
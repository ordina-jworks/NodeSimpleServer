import {NodeWorker}     from '../node-worker';
import {IPCMessage}     from "../../ipc/ipc-message";
import {MessageTarget}  from "../../ipc/message-target";
import {MessageHandler} from "../../ipc/message-handler";

export class DataBroker implements NodeWorker {

    workerId: string;

    private handler: MessageHandler = MessageHandler.getInstance();

    constructor(workerId: string) {
        this.workerId = workerId;
        this.handler.emitter.on(MessageTarget[MessageTarget.DATA_BROKER] + '', this.onMessage);

        console.log('[id:' + workerId + '] DataBroker created');
    }

    public start(): void {
        console.log('DataBroker starting...');
    }

    public onMessage(message: IPCMessage): void {
        console.log('Databroker message received');
    }
}
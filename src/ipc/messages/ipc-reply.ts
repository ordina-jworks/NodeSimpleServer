import {IPCMessage} from "./ipc-message";
import {IPCRequest} from "./ipc-request";

export class IPCReply extends IPCMessage {

    public originalMessage:IPCRequest = null;

    constructor (workerId: string, payload: any, originalMessage: IPCRequest) {
        super(IPCMessage.TYPE_REPLY);
        this.workerId = workerId;
        this.payload = payload;
        this.originalMessage = originalMessage;
    }
}
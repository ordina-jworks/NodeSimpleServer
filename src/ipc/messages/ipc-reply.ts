import {IPCMessage} from "./ipc-message";
import {IPCRequest} from "./ipc-request";

/**
 * IPCReply class.
 *
 * Extension of the IPCMessage base class. This type of IPCMessage should be used to send replies.
 */
export class IPCReply extends IPCMessage {

    public originalMessage:IPCRequest = null;

    /**
     * Constructor for IPCReply.
     *
     * @param workerId The workerId from the worker where this message originates.
     * @param payload The payload to go with the message. This can be data of any type and is meant for the callee.
     * @param originalMessage The original IPCMessage for which this message is the reply.
     */
    constructor (workerId: number, payload: any, originalMessage: IPCRequest) {
        super(IPCMessage.TYPE_REPLY);

        this.workerId = workerId;
        this.payload = payload;
        this.originalMessage = originalMessage;
    }
}
import {IPCMessage}     from "./ipc-message";
import {MessageTarget}  from "../message-target";

/**
 * IPCRequest class.
 *
 * Extension of the IPCMessage base class. This type of IPCMessage should be used to send the initial messages.
 */
export class IPCRequest extends IPCMessage {

    public callbackId: string               = null;
    public target: MessageTarget            = null;
    public targetFunctionName: string       = null;

    /**
     * constructor for IPCRequest.
     *
     * @param workerId The workerId from the worker where this message originates.
     * @param callbackId The callbackId for the function that is to be called when a reply is received.
     * @param payload The payload to go with the message. This can be data of any type and is meant for the callee.
     * @param target The target worker that the message should be sent too.
     * @param targetFunctionName The name of the function that should be executed on the target.
     */
    constructor(workerId: string, callbackId: string, payload: any, target: MessageTarget, targetFunctionName: string) {
        super(IPCMessage.TYPE_REQUEST);

        this.workerId           = workerId;
        this.callbackId         = callbackId;
        this.payload            = payload;
        this.target             = target;
        this.targetFunctionName = targetFunctionName;
    }
}
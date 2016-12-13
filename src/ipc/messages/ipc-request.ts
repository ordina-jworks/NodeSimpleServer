import {IPCMessage}     from "./ipc-message";
import {MessageTarget}  from "../message-target";

export class IPCRequest extends IPCMessage {

    public callbackId: string               = null;
    public target: MessageTarget            = null;
    public targetFunctionName: string       = null;

    constructor(workerId: string, callbackId: string, payload: any, target: MessageTarget, targetFunctionName: string) {
        super(IPCMessage.TYPE_REQUEST);
        this.workerId           = workerId;
        this.callbackId         = callbackId;
        this.payload            = payload;
        this.target             = target;
        this.targetFunctionName = targetFunctionName;
    }
}
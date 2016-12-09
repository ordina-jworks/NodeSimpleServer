import {MessageTarget} from "./message-target";

export class IPCMessage {

    public workerId: string                 = null;
    public callbackId: string               = null;
    public payload: any                     = null;
    public target: MessageTarget            = null;
    public targetFunctionName: string       = null;

    constructor(workerId: string, callbackId: string, payload: any, target: MessageTarget, targetFunctionName: string) {
        this.workerId           = workerId;
        this.callbackId         = callbackId;
        this.payload            = payload;
        this.target             = target;
        this.targetFunctionName = targetFunctionName;
    }
}
import cluster          = require('cluster');

import {IPCMessage} from "./ipcmessage";
import {MessageTarget} from "./message-target";

export class MessageManager {

    private static instance: MessageManager = null;

    //Variables:
    private callbacks: Array<[string, Function]>    = null;
    private workerId: string                        = null;

    private constructor() {
        this.callbacks = [];
        this.workerId = cluster.worker.id;
    }

    public static getInstance() {
        if(!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }

    public sendMessage(payload: any, messageTarget: MessageTarget, targetFunctionName: string) {
        let message: IPCMessage = new IPCMessage(this.workerId, null, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    public sendMessageWithCallback(payload: any, callback: Function, messageTarget: MessageTarget, targetFunctionName: string): void {
        let callbackId: string = process.hrtime()  + "--" + (Math.random() * 6);
        this.callbacks.push([callbackId, callback]);

        let message: IPCMessage = new IPCMessage(this.workerId, callbackId, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    public sendReply(payload: any, originalMessage: IPCMessage): void {
        //let reply: IPCMessage = new IPCReply(this.workerId, payload, originalMessage);
        //process.send(reply);
    }

    public executeCallbackForId(callbackId: string) :void {
        for (let callbackEntry of this.callbacks) {
            if(callbackEntry[0] == callbackId) {
                callbackEntry[1]();
                return;
            }
        }
    }
}
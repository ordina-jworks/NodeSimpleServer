import cluster          = require('cluster');

import {IPCMessage}     from "./messages/ipc-message";
import {MessageTarget}  from "./message-target";
import {IPCRequest}     from "./messages/ipc-request";
import {IPCReply}       from "./messages/ipc-reply";

/**
 * MessageManager singleton class.
 *
 * This singleton can be used to manage IPC messages.
 */
export class MessageManager {

    private static instance: MessageManager         = null;
    private callbacks: Array<[string, Function]>    = null;
    private workerId: string                        = null;

    /**
     * Private constructor for the singleton.
     */
    private constructor() {
        this.callbacks = [];
        this.workerId = cluster.worker.id;
    }

    /**
     * Use this method to get the instance of this singleton class.
     *
     * @returns {MessageManager} The instance of this singleton class.
     */
    public static getInstance(): MessageManager {
        if(!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }

    /**
     *
     * @param payload
     * @param messageTarget
     * @param targetFunctionName
     */
    public sendMessage(payload: any, messageTarget: MessageTarget, targetFunctionName: string): void {
        let message: IPCMessage = new IPCRequest(this.workerId, null, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    /**
     *
     * @param payload
     * @param callback
     * @param messageTarget
     * @param targetFunctionName
     */
    public sendMessageWithCallback(payload: any, callback: Function, messageTarget: MessageTarget, targetFunctionName: string): void {
        let callbackId: string = process.hrtime()  + "--" + (Math.random() * 6);
        this.callbacks.push([callbackId, callback]);

        let message: IPCMessage = new IPCRequest(this.workerId, callbackId, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    /**
     *
     * @param payload
     * @param originalMessage
     */
    public sendReply(payload: any, originalMessage: IPCRequest): void {
        let reply: IPCMessage = new IPCReply(this.workerId, payload, originalMessage);
        process.send(reply);
    }

    /**
     *
     * @param callbackId
     */
    public executeCallbackForId(callbackId: string) :void {
        for (let callbackEntry of this.callbacks) {
            if(callbackEntry[0] == callbackId) {
                callbackEntry[1]();
                return;
            }
        }
    }
}
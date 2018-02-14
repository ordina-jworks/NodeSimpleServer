import cluster          = require('cluster');

import {IPCMessage}     from "./messages/ipc-message";
import {MessageTarget}  from "./message-target";
import {IPCRequest}     from "./messages/ipc-request";
import {IPCReply}       from "./messages/ipc-reply";

/**
 * MessageManager singleton class.
 * This class has an array of tuples of string and Function.
 * The string field is the callbackId and the Function is the actual callback.
 * The message manager is a per worker instance that can only execute callbacks on the same worker.
 * The integration with the IPC framework allows messages to be sent to other workers and replies to be sent back to the original worker.
 * It is important that the original worker is called to execute the callback since a function cannot cross a node instance!
 *
 * This singleton can be used to manage IPC messages.
 */
export class MessageManager {

    private static instance: MessageManager         = null;
    private callbacks: Array<[string, Function]>    = null;
    private workerId: number                        = null;

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
     * Sends an IPCMessage of the subtype IPCRequest to the given MessageTarget (one of the three worker types).
     * A target function is also given and contains the name of the function that will be executed on the target.
     * The target should implement a specific handler or switch statement to handle these different target function names.
     * This message is sent without a callback. This means that when the target function has finished no reply will be sent to inform the caller.
     *
     * @param payload The payload for the target, can be of any kind.
     * @param messageTarget The MessageTarget, being one of the three types of workers.
     * @param targetFunctionName The name of the function to be executed on the target. This value is NOT evaluated by eval for security reasons.
     */
    public sendMessage(payload: any, messageTarget: MessageTarget, targetFunctionName: string): void {
        console.log('[WORKER id:' + this.workerId + '] Sending request message.');
        let message: IPCMessage = new IPCRequest(this.workerId, null, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    /**
     * Sends an IPCMessage of the subtype IPCRequest to the given MessageTarget (one of the three worker types).
     * A target function is also given and contains the name of the function that will be executed on the target.
     * The target should implement a specific handler or switch statement to handle these different target function names.
     * This message is sent with a callback. The callee sends a new IPCMessage of the subtype IPCReply to inform the caller and provide it with new information if needed.
     * A reply can be sent by using the sendReply method on this class.
     *
     * @param payload The payload for the target, can be of any kind.
     * @param callback The function that should be called when a reply has been received.
     * @param messageTarget The MessageTarget, being one of the three types of workers.
     * @param targetFunctionName The name of the function to be executed on the target. This value is NOT evaluated by eval for security reasons.
     */
    public sendMessageWithCallback(payload: any, callback: Function, messageTarget: MessageTarget, targetFunctionName: string): void {
        let callbackId: string = process.hrtime()  + "--" + (Math.random() * 6);
        this.callbacks.push([callbackId, callback]);

        console.log('[WORKER id:' + this.workerId + '] Sending request message with callback (' + callbackId + ')');
        let message: IPCMessage = new IPCRequest(this.workerId, callbackId, payload, messageTarget, targetFunctionName);
        process.send(message);
    }

    /**
     * Sends and IPCMessage of the subtype IPCReply to the sender of the original message.
     *
     * @param payload A new payload to provide to the original sender.
     * @param originalMessage The message the sender originally sent.
     */
    public sendReply(payload: any, originalMessage: IPCRequest): void {
        console.log('[WORKER id:' + this.workerId + '] Sending reply message (callback: ' + originalMessage.callbackId + ')');
        let reply: IPCMessage = new IPCReply(this.workerId, payload, originalMessage);
        process.send(reply);
    }

    /**
     * For a given callbackId execute the callback function.
     *
     * @param reply The IPCReply that contains the callback that needs to be executed.
     */
    public executeCallbackForId(reply: IPCReply) :void {
        for (let callbackEntry of this.callbacks) {
            if(callbackEntry[0] == reply.originalMessage.callbackId) {
                callbackEntry[1](reply);
                return;
            }
        }
        console.log('[WORKER id:' + this.workerId + '] No matching callback found to execute!');
    }
}
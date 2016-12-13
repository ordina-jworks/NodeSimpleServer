import {IPCMessage} from "../ipc/messages/ipc-message";
import {MessageHandler} from "../ipc/message-handler";

/**
 * Interface for all the NodeWorker implementations.
 */
export interface NodeWorker {

    workerId: string;
    handler: MessageHandler;

    /**
     * Starts the worker.
     */
    start(): void;

    /**
     * Handler for incoming IPC messages.
     *
     * @param message The message that is received. This message can be of type IPCRequest or IPCReply.
     * The base class IPCMessage has a field type which contains the actual type.
     */
    onMessage(message: IPCMessage): void;
}
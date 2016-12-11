import {IPCMessage} from "../ipc/ipc-message";

export interface NodeWorker {

    workerId: string;

    start();

    onMessage(message: IPCMessage): void;
}
import {IPCMessage} from "../ipc/ipcmessage";

export interface NodeWorker {

    workerId: string;

    start();

    onMessage(message: IPCMessage): void;
}
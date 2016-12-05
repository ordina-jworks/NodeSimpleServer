import {NodeWorker} from '../nodeworker';
import {Server}     from "../../web/server";

export class HttpWorker implements NodeWorker {

    workerId: string;
    private server: Server;

    constructor(workerId: string) {
        this.workerId = workerId;

        console.log('[id:' + workerId + '] HttpWorker created');
        this.start();
    }

    public start = (): void => {
        console.log('[id:' + this.workerId + '] HttpWorker starting...');
        this.server = new Server(this.workerId);
    }
}
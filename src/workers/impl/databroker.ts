import {NodeWorker} from '../nodeworker';

export class DataBroker implements NodeWorker {

    workerId: string;

    constructor(workerId: string) {
        this.workerId = workerId;

        console.log('[id:' + workerId + '] DataBroker created');
    }

    public start(): void {
        console.log('DataBroker starting...');
    }
}
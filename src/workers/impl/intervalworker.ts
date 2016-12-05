import {NodeWorker} from '../nodeworker';

export class IntervalWorker implements NodeWorker {

    workerId: string;

    constructor(workerId: string) {
        this.workerId = workerId;

        console.log('[id:' + workerId + '] IntervalWorker created');
    }

    public start(): void {
        console.log('IntervalWorker starting...');
    }
}
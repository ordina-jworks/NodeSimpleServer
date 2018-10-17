import os = require('os');
import cluster = require('cluster');

import { MessageHandler } from "./ipc/message-handler";
import { WorkerFactory } from "./workers/worker-factory";

class SimpleNodeServer {

    private isDebug: boolean = false;

    private httpWorkers: Array<cluster.Worker> = null;
    private intervalWorker: cluster.Worker = null;
    private databroker: cluster.Worker = null;

    private messageHandler: MessageHandler = null;

    /**
     * Constructor for SimpleNodeServer.
     *
     * @param isDebug Set this to true is the application should run in debug mode.
     * This will prevent dead workers from being revived.
     */
    constructor(isDebug: boolean) {
        this.isDebug = isDebug;
        this.httpWorkers = [];
    }

    /**
     * Use this method to start the application!
     */
    public start(): void {
        if (cluster.isMaster) {
            console.log('--------------------------------------------------------------------------');
            console.log('--------------------------------------------------------------------------');
            console.log('                         Simple Node Server V0.1                          ');
            console.log('--------------------------------------------------------------------------');
            console.log('--------------------------------------------------------------------------');

            this.forkWorkers();
            this.bindMessageHandling();
        } else {
            this.messageHandler = MessageHandler.getInstance();
            this.messageHandler.initForSlave();
            WorkerFactory.createWorker(this.messageHandler);
        }
    };

    /**
     * Forks the workers, there will always be one DataBroker and one IntervalWorker.
     * HTTPWorker will be created based on the number of cpu cores. If less than two cores are available
     * two http workers will be created.
     */
    private forkWorkers(): void {
        //Fork data broker.
        this.databroker = cluster.fork({ name: 'broker', debug: this.isDebug });

        //Fork interval worker.
        this.intervalWorker = cluster.fork({ name: 'interval', debug: this.isDebug });

        //Fork normal server worker instances. These will handle all HTTP requests.
        let cores: number = os.cpus().length;
        let numberOfHttpWorkers: number = cores - 2 > 0 ? cores - 2 : 1;
        console.log('[MASTER] There are ' + cores + ' cores available, starting ' + numberOfHttpWorkers + ' HTTP workers...');

        for (let i: number = 0; i < numberOfHttpWorkers; i++) {
            let worker = cluster.fork({ name: 'http', debug: this.isDebug });
            this.httpWorkers.push(worker);
        }

        //Revive workers if they die!
        if (!this.isDebug) {
            cluster.on('exit', this.reviveWorker);
        }
    };

    /**
     * Binds the message handling for the master process!
     */
    private bindMessageHandling(): void {
        this.messageHandler = MessageHandler.getInstance();
        this.messageHandler.initForMaster(this.databroker, this.intervalWorker, this.httpWorkers);

        this.databroker.on('message', this.messageHandler.onDataBrokerMessageReceived);
        this.intervalWorker.on('message', this.messageHandler.onIntervalWorkerMessageReceived);

        for (let i: number = 0; i < this.httpWorkers.length; i++) {
            this.httpWorkers[i].on('message', this.messageHandler.onServerWorkerMessageReceived);
        }
    };

    /**
     * Revives dead workers. If a worker dies it can be revived by using this method.
     *
     * @param worker The worker instance that has died.
     * @param code The code indicating why the worker died.
     * @param signal The signal indicating why the worker died.
     */
    private reviveWorker = (worker: cluster.Worker, code: number, signal: string): void => {
        //CHARGING...
        console.log('[MASTER] Worker ' + worker.id + ' died! (details => code: ' + code + ' signal: ' + signal);

        //CLEAR!
        switch (worker.id) {
            case this.databroker.id:
                this.databroker = cluster.fork({ name: 'broker', debug: this.isDebug });
                this.databroker.on('message', this.messageHandler.onDataBrokerMessageReceived);
                break;
            case this.intervalWorker.id:
                this.intervalWorker = cluster.fork({ name: 'interval', debug: this.isDebug });
                this.intervalWorker.on('message', this.messageHandler.onIntervalWorkerMessageReceived);
                break;
            default:
                cluster.fork({ name: 'http', debug: this.isDebug }).on('message', this.messageHandler.onServerWorkerMessageReceived);
        }
    };
}
new SimpleNodeServer(false).start();
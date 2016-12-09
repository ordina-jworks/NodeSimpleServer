import os               = require('os');
import cluster          = require('cluster');

import {MessageHandler} from "./ipc/messagehandler";
import {WorkerFactory}  from "./workers/workerfactory";

class SimpleNodeServer {

    private isDebug         : boolean;

    private httpWorkers     : Array<cluster.Worker>;
    private intervalWorker  : cluster.Worker;
    private databroker      : cluster.Worker;

    private messageHandler  : MessageHandler;

    constructor(isDebug: boolean) {
        this.isDebug = isDebug;
        this.httpWorkers = [];
    }

    public start = (): void => {
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

    private forkWorkers = (): void =>{
        //Fork data broker.
        this.databroker = cluster.fork({name: 'broker', debug: this.isDebug});

        //Fork interval worker.
        this.intervalWorker = cluster.fork({name: 'interval', debug: this.isDebug});

        //Fork normal server worker instances. These will handle all HTTP requests.
        let cores:number                = os.cpus().length;
        let numberOfHttpWorkers:number  = cores - 2 > 0 ? cores - 2 : 1;
        console.log('There are ' + cores + ' cores available, starting ' + numberOfHttpWorkers + ' HTTP workers...');

        for (let i:number = 0; i < numberOfHttpWorkers; i++) {
            let worker = cluster.fork({name: 'http', debug: this.isDebug});
            this.httpWorkers.push(worker);
        }

        //Revive workers if they die!
        if(!this.isDebug) {
            cluster.on('exit', this.reviveWorker);
        }
    };

    private bindMessageHandling = (): void => {
        this.messageHandler = MessageHandler.getInstance();
        this.messageHandler.initForMaster(this.databroker, this.intervalWorker, this.httpWorkers);

        this.databroker.on('message', this.messageHandler.onDataBrokerMessageReceived);
        this.intervalWorker.on('message', this.messageHandler.onIntervalWorkerMessageReceived);

        for(let i:number = 0; i < this.httpWorkers.length; i++){
            this.httpWorkers[i].on('message', this.messageHandler.onServerWorkerMessageReceived);
        }
    };

    private reviveWorker = (worker, code, signal): void => {
        //CHARGING...
        console.log('worker ' + worker.id + ' died! (details => code: ' + code + ' signal: ' + signal);

        //CLEAR!
        switch (worker.id) {
            case this.databroker.id:
                this.databroker = cluster.fork({name: 'broker', debug: this.isDebug});
                this.databroker.on('message', this.messageHandler.onDataBrokerMessageReceived);
                break;
            case this.intervalWorker.id:
                this.intervalWorker = cluster.fork({name: 'interval', debug: this.isDebug});
                this.intervalWorker.on('message', this.messageHandler.onIntervalWorkerMessageReceived);
                break;
            default:
                cluster.fork({name: 'http', debug: this.isDebug}).on('message', this.messageHandler.onServerWorkerMessageReceived);
        }
    };
}
new SimpleNodeServer(true).start();
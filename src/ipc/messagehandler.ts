import cluster          = require('cluster');

export class MessageHandler {

    static TARGET_BROKER            = 'TARGET_BROKER';
    static TARGET_INTERVAL_WORKER   = 'TARGET_INTERVAL_WORKER';
    static TARGET_HTTP_WORKER       = 'TARGET_HTTP_WORKER';

    dataBroker      : cluster.Worker;
    intervalWorker  : cluster.Worker;
    httpWorkers     : Array<cluster.Worker>;

    constructor(dataBroker: cluster.Worker, intervalWorker: cluster.Worker, httpWorkers: Array<cluster.Worker>) {
        this.dataBroker     = dataBroker;
        this.intervalWorker = intervalWorker;
        this.httpWorkers    = httpWorkers;
    }

    /******************************************************************************************************************
    *******************************************************************************************************************
    *                                            MASTER MESSAGE HANDLERS                                              *
    *******************************************************************************************************************
    ******************************************************************************************************************/

    public onServerWorkerMessageReceived = (msg): void => {
        console.log('Message received from server worker: ' + msg);
        this.targetHandler(msg);
    };

    public onIntervalWorkerMessageReceived = (msg): void => {
        console.log('Message received from interval worker: ' + msg);
        this.targetHandler(msg);
    };

    public onDataBrokerMessageReceived = (msg): void => {
        console.log('Message received from data broker: ' + msg);
        cluster.workers[msg.workerId].send(msg);
        //TODO: Support the case where the Data broker actually sends a message by itself (and not responds to an earlier message from a worker!)
    };

    private targetHandler = (msg) => {
        switch (msg.target){
            case MessageHandler.TARGET_BROKER:
                this.dataBroker.send(msg);
                break;
            case MessageHandler.TARGET_INTERVAL_WORKER:
                this.intervalWorker.send(msg);
                break;
            case MessageHandler.TARGET_HTTP_WORKER:
                var index = Math.round(Math.random() * this.httpWorkers.length) - 1;
                index = index === -1 ? 0 : index;
                this.httpWorkers[index].send(msg);
                break;
            default:
                //cluster.workers[msg.workerId].send({data: msg});
                console.error('Cannot find message target: ' + msg.target);
        }
    };

    /*******************************************************************************************************************
     *******************************************************************************************************************
     *                                           WORKER MESSAGE HANDLERS                                               *
     *******************************************************************************************************************
     *******************************************************************************************************************/

    public onMessageFromMasterReceived = (msg): void => {
        console.log("Received message from master: routing to: " + msg.handler + "." + msg.handlerFunction + "MessageHandler(\"\")");
        eval(msg.handler)[msg.handlerFunction](msg);
    };
}
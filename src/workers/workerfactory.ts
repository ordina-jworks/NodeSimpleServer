import cluster          = require('cluster');

import {DataBroker}     from './impl/databroker';
import {IntervalWorker} from './impl/intervalworker';
import {HttpWorker}     from './impl/httpworker';
import {MessageHandler} from '../ipc/messagehandler';

export class WorkerFactory {

    public static createWorker(messageHandler: MessageHandler): void {
        console.log('[id:' + cluster.worker.id + '] Determining type of and starting worker...');

        switch (process.env["name"]) {
            case "broker":
                cluster.worker.on("message", messageHandler.onMessageFromMasterReceived);
                new DataBroker(cluster.worker.id);
                break;
            case "interval":
                cluster.worker.on("message", messageHandler.onMessageFromMasterReceived);
                new IntervalWorker(cluster.worker.id).start();
                break;
            case "http":
                cluster.worker.on("message", messageHandler.onMessageFromMasterReceived);
                new HttpWorker(cluster.worker.id);
                break;
            default:
                console.error("Unknown worker type, cannot create a worker of type: " + process.env['name']);
                return;
        }
    }
}
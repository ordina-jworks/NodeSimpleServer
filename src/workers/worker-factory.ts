import cluster          = require('cluster');

import {DataBroker}     from './impl/data-broker';
import {IntervalWorker} from './impl/interval-worker';
import {HttpWorker}     from './impl/http-worker';
import {MessageHandler} from '../ipc/message-handler';

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
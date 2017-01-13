import cluster          = require('cluster');

import {DataBroker}     from './impl/databroker/data-broker';
import {IntervalWorker} from './impl/interval-worker';
import {HttpWorker}     from './impl/http-worker';
import {MessageHandler} from '../ipc/message-handler';

/**
 * WorkerFactory class.
 *
 * This class has a static method to create new workers.
 */
export class WorkerFactory {

    /**
     * Creates a worker. Depending on the process variable 'name' a worker of the following types can be created:
     * - DataBroker
     * - IntervalWorker
     * - HTTPWorker
     *
     * @param messageHandler The MessageHandler instance that will be used to handle IPC messaging.
     */
    public static createWorker(messageHandler: MessageHandler): void {
        console.log('[id:' + cluster.worker.id + '] Determining type of and starting worker...');

        switch (process.env['name']) {
            case 'broker':
                cluster.worker.on('message', messageHandler.onMessageFromMasterReceived);
                new DataBroker(cluster.worker.id);
                break;
            case 'interval':
                cluster.worker.on('message', messageHandler.onMessageFromMasterReceived);
                new IntervalWorker(cluster.worker.id).start();
                break;
            case 'http':
                cluster.worker.on('message', messageHandler.onMessageFromMasterReceived);
                new HttpWorker(cluster.worker.id);
                break;
            default:
                console.error('Unknown worker type, cannot create a worker of type: ' + process.env['name']);
                return;
        }
    }
}
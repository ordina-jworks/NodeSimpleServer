import {NodeWorker}             from '../../node-worker';
import {IPCMessage}             from "../../../ipc/messages/ipc-message";
import {MessageTarget}          from "../../../ipc/message-target";
import {MessageHandler}         from "../../../ipc/message-handler";
import {IPCRequest}             from "../../../ipc/messages/ipc-request";
import {DataBrokerOperation}    from "./data-broker-operation";
import {Cache}                  from "./cache";

/**
 * DataBroker class.
 *
 * This worker is used to perform data operations.
 */
export class DataBroker implements NodeWorker {

    workerId: string                            = null;
    handler: MessageHandler                     = null;

    private caches: Array<[string, Cache<any>]> = null;

    /**
     * Constructor for the DataBroker.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: string) {
        this.workerId = workerId;

        this.handler = MessageHandler.getInstance();
        this.handler.emitter.on(MessageTarget[MessageTarget.DATA_BROKER] + '', this.onMessage);

        console.log('[id:' + workerId + '] DataBroker created');
    }

    /**
     * Starts the DataBroker instance.
     */
    public start = (): void => {
        console.log('DataBroker starting...');

        this.caches = [];
    };

    //TODO: Null checks on the getCacheByName result!
    //TODO: Check when adding a new key/value pair that the key is not used!
    //TODO: Check when adding a new cache that the name is not used!

    /**
     * Retrieves the value for a specific key in a specific cache.
     *
     * @param cacheName The name of the cache to look in.
     * @param key The key for which the value should be returned.
     * @returns {any} The value if any was found, null if not.
     */
    private retrieve = (cacheName: string, key: string): any => {
        return this.getCacheByName(cacheName).retrieve(key);
    };

    /**
     * Saves the given key/value pair in the given cache.
     *
     * @param cacheName The name of the cache to save to.
     * @param key The key under which to save the value.
     * @param value the value to save.
     */
    private save = (cacheName: string, key: string, value: any): void => {
        this.getCacheByName(cacheName).save(key, value);
    };

    /**
     * Updates the given key/value pair in the given cache.
     *
     * @param cacheName The name of the cache to update in.
     * @param key The key of the key/value pair to update.
     * @param value The value of the key/value pair to update.
     */
    private update = (cacheName: string, key: string, value: any): void => {
        this.getCacheByName(cacheName).update(key, value);
    };

    /**
     * Deletes the given key (with its value) from the given cache.
     *
     * @param cacheName The cache name to delete the key/value pair from.
     * @param key The key for which to delete the entry (key/value) in the cache.
     */
    private deleter = (cacheName: string, key: string): void => {
        return this.getCacheByName(cacheName).deleter(key);
    };

    /**
     * Returns the Cache instance for the given cache name.
     *
     * @param cacheName The name of the cache to retrieve.
     * @returns {Cache<any>} The retrieved cache, or null if none was found.
     */
    private retrieveCache = (cacheName: string): any => {
        return this.getCacheByName(cacheName);
    };

    /**
     * Creates a new Cache for the given cache name.
     *
     * @param cacheName The name of the cache to create.
     */
    private createCache = (cacheName: string): void => {
        this.caches.push([cacheName, new Cache<any>()]);
    };

    /**
     * Deletes the cache with the given cache name.
     *
     * @param cacheName The name of the cache to delete.
     */
    private deleteCache = (cacheName: string): void => {
        let index: number = -1;
        for(let i: number = 0; i < this.caches.length; i++) {
            if(this.caches[i][0] == cacheName) {
                index = i;
                break;
            }
        }

        if(index >= 0) {

        } else {
            console.error('Could not delete, key/value not found!');
        }
    };

    /**
     * Get the cache by the name of the cache.
     *
     * @param cacheName The name of the cache to get.
     * @returns {any} The Cache instance for which the name matches.
     */
    private getCacheByName = (cacheName: string): Cache<any> => {
        for (let cache of this.caches) {
            if(cache[0] == cacheName) {
                return cache[1];
            }
        }
        return null;
    };

    /**
     * Handler for IPC messages. This method is called when an IPCMessage is received from any other worker.
     *
     * @param message The IPCMessage that is received. Can be of subtypes IPCRequest or IPCReply.
     */
    public onMessage(message: IPCMessage): void {
        console.log('Databroker message received');

        if(message.type == IPCMessage.TYPE_REQUEST) {
            let m: IPCRequest = <IPCRequest>message;

            //While this requires more manual work than working with an eval() statement. It is much much safer.
            switch (m.targetFunction) {
                case DataBrokerOperation.RETRIEVE:
                    this.retrieve(m.payload['cacheName'], m.payload['key']);
                    break;
                case DataBrokerOperation.SAVE:
                    this.save(m.payload['cacheName'], m.payload['key'], m.payload['value']);
                    break;
                case DataBrokerOperation.UPDATE:
                    this.update(m.payload['cacheName'], m.payload['key'], m.payload['value']);
                    break;
                case DataBrokerOperation.DELETE:
                    this.deleter(m.payload['cacheName'], m.payload['key']);
                    break;
                case DataBrokerOperation.RETRIEVE_CACHE:
                    this.retrieveCache(m.payload['cacheName']);
                    break;
                case DataBrokerOperation.CREATE_CACHE:
                    this.createCache(m.payload['cacheName']);
                    break;
                case DataBrokerOperation.DELETE_CACHE:
                    this.deleteCache(m.payload['cacheName']);
                    break;
                default:
                    console.log('No valid target handler found!');
            }
        }
    }
}
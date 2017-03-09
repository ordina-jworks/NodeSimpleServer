import {Config} from "../../../../resources/config";

/**
 * Cache class.
 *
 * This class contains the cache values and operations that can be performed on them.
 */
export class Cache<T> {

    private config: Config = Config.getInstance();

    private _maxSize: number             = null;
    private values: Array<[string, T]>  = null;

    /**
     * Constructor for the Cache.
     */
    constructor(size?: number) {
        if(size) {
            this._maxSize = size;
        } else {
            this._maxSize = this.config.settings.defaultCacheSize;
        }
        this.values = [];
    }

    /**
     * Retrieves the value for the given key.
     * If no match is found, null is returned.
     *
     * @param key The key for which to retrieve the value.
     * @returns {any} The value that goes with the key.
     */
    public retrieve = (key: string): T => {
        for (let valuePair of this.values) {
            if(valuePair[0] == key) {
                return valuePair[1];
            }
        }

        return null;
    };

    /**
     *
     * @returns {Array<[string,T]>}
     */
    public getAllValues = (): Array<[string, T]> => {
        return this.values;
    };

    /**
     * Saves the given key with the corresponding value in the cache.
     *
     * @param key The key to store the value with.
     * @param value The actual value to be stored.
     */
    public save = (key: string, value: T): void => {
        if(this.values.length >= this._maxSize) {
            console.log('Max cache length reached, shifting data out of cache!');
            this.values.shift();
        }
        this.values.push([key, value]);
    };

    /**
     * Update the value for the given key/value combination.
     * The key will be looked up and the value will be updated to the one that is provided.
     *
     * @param key The key for which to update the value.
     * @param value The new value to be stored with the key.
     */
    public update = (key: string, value: T): void => {
        let index: number = this.getIndexForKey(key);

        if(index >= 0) {
            this.values[index] = [key, value];
        } else {
            console.error('Could not update, key/value not found!');
        }
    };

    /**
     * Delete the value (and key) for the given key from the cache.
     *
     * @param key The key which should be deleted (with its value).
     */
    public deleter = (key: string): void => {
        let index: number = this.getIndexForKey(key);

        if (index > -1) {
            this.values.splice(index, 1);
        } else {
            console.error('Could not delete, cache not found!');
        }
    };

    /**
     * Getter for the maxSize field.
     *
     * @returns {number} The value that contains the max size for the cache instance.
     */
    public get maxSize(): number {
        return this._maxSize;
    }

    /**
     * Getter for the actual cache size.
     *
     * @returns {number} The value that contains the actual size for the cache instance.
     */
    public get actualSize(): number {
        return this.values.length;
    }

    /**
     * For a given key, try to find the index in the cache.
     * If no match is found -1 is returned.
     *
     * @param key The key for which to find the index in the cache.
     * @returns {number} The index in the cache or -1 if none was found.
     */
    private getIndexForKey = (key: string): number => {
        let index: number = -1;
        for(let i: number = 0; i < this.values.length; i++) {
            if(this.values[i][0] == key) {
                index = i;
                break;
            }
        }

        return index;
    };
}
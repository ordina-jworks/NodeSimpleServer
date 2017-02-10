import {EndPointDefinition} from "./endpoint-definition";

/**
 * EndPointManager singleton class.
 *
 * This singleton can be used to manage endpoints.
 */
export class EndPointManager {

    private static instance: EndPointManager                      = null;
    public endpoints: Array<EndPointDefinition<any, any, any>>    = null;

    /**
     * Private constructor for the singleton.
     */
    private constructor() {
        this.endpoints = [];
    }

    /**
     * Use this method to get the instance of this singleton class.
     *
     * @returns {EndPointManager} The instance of this singleton class.
     */
    static getInstance = (): EndPointManager => {
        if (!EndPointManager.instance) {
            EndPointManager.instance = new EndPointManager();
        }
        return EndPointManager.instance;
    };

    /**
     * Registers an endpoint and make it available for all future HTTP Requests.
     *
     * @param endpoint The endpoint that should be added to the list of registered endpoints.
     */
    public registerEndpoint = (endpoint: EndPointDefinition<any, any, any>): void => {
        this.endpoints.push(endpoint);
    };

    /**
     * Use this to get a List of all registered endpoints.
     *
     * @returns {Array<EndPointDefinition<any, any, any>>} An array containing all the registered endpoints.
     */
    public getEndpoints = (): Array<EndPointDefinition<any, any, any>> => {
        return this.endpoints;
    };

    /**
     * This method is used to query the list of endpoints to see if it contains an endpoint for the given path.
     * If an endpoint is found, it is returned. If no endpoint can be found null is returned.
     *
     * @param path The path for which an endpoint should be registered.
     * @returns {any} Either an endpoint or null.
     */
    public getEndpoint = (path: string): EndPointDefinition<any, any, any> => {
        for(let i = 0; i < this.endpoints.length; i++) {
            let endPoint: EndPointDefinition<any, any, any> = this.endpoints[i];

            if(endPoint.path == path || (endPoint.path + '/' == path && endPoint.parameters.length > 0)) {
                return this.endpoints[i];
            }
        }
        return null;
    };

    /**
     * Unregisters an endpoint. Remove the endpoint from the list of registered endpoints.
     * If no endpoint can be found for the given path, nothing is done.
     *
     * @param path The path for which if an endpoint is found, it should be removed.
     */
    public unRegisterEndpoint(path: string) {
        //TODO: Implement!
    };
}
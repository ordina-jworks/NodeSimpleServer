import {EndpointDefinition} from "./endpoint-definition";

/**
 * EndpointManager singleton class.
 *
 * This singleton can be used to manage endpoints.
 */
export class EndpointManager {

    private static instance: EndpointManager            = null;
    public endpoints: Array<EndpointDefinition<any>>    = null;

    /**
     * Private constructor for the singleton.
     */
    private constructor() {
        this.endpoints = [];
    }

    /**
     * Use this method to get the instance of this singleton class.
     *
     * @returns {EndpointManager} The instance of this singleton class.
     */
    static getInstance = (): EndpointManager => {
        if (!EndpointManager.instance) {
            EndpointManager.instance = new EndpointManager();
        }
        return EndpointManager.instance;
    };

    /**
     * Registers an endpoint and make it available for all future HTTP Requests.
     * The Path of the given endpoint should be unique, meaning no other endpoint should have been registered with the path of the endpoint to register.
     * If The path is not unique, the endpoint will not be added and an error message will be logged!
     *
     * @param endpoint The endpoint that should be added to the list of registered endpoints.
     */
    public registerEndpoint = (endpoint: EndpointDefinition<any>): void => {
        for (let existingEndpoint of this.endpoints) {
            if(endpoint.path == existingEndpoint.path) {
                console.error('An endpoint has already been registered with the same path! Paths have to be unique!');
                return;
            }
        }
        this.endpoints.push(endpoint);
    };

    /**
     * Use this to get a List of all registered endpoints.
     *
     * @returns {Array<EndpointDefinition<any>>} An array containing all the registered endpoints.
     */
    public getEndpoints = (): Array<EndpointDefinition<any>> => {
        return this.endpoints;
    };

    /**
     * This method is used to query the list of endpoints to see if it contains an endpoint for the given path.
     * If an endpoint is found, it is returned. If no endpoint can be found null is returned.
     *
     * @param path The path for which an endpoint should be registered.
     * @returns {any} Either an endpoint or null.
     */
    public getEndpoint = (path: string): EndpointDefinition<any> => {
        for(let i = 0; i < this.endpoints.length; i++) {
            let endPoint: EndpointDefinition<any> = this.endpoints[i];

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
        for (let existingEndpoint of this.endpoints) {
            if(existingEndpoint.path == path) {
                this.endpoints.splice(this.endpoints.indexOf(existingEndpoint), 1);
                console.log('Endpoint has been removed!');
                return;
            }
        }
        console.log('No match found for path, no Endpoint removed!')
    };
}
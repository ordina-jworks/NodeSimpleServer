import {EndPoint} from "./endpoint";

export class EndPointManager {

    private static instance: EndPointManager;

    //Variables:
    public endpoints: Array<EndPoint<any, any, any>> = [];

    private constructor() {

    }

    static getInstance = (): EndPointManager => {
        if (!EndPointManager.instance) {
            EndPointManager.instance = new EndPointManager();
        }
        return EndPointManager.instance;
    };

    public registerEndpoint = (endpoint: EndPoint<any, any, any>): void => {
        this.endpoints.push(endpoint);
    };

    public getEndpoints = (): Array<EndPoint<any, any, any>> => {
        return this.endpoints;
    };

    public getEndpoint = (path: string): EndPoint<any, any, any> => {
        for(let i = 0; i < this.endpoints.length; i++) {
            let endPoint: EndPoint<any, any, any> = this.endpoints[i];

            if(endPoint.path == path || (endPoint.path + '/' == path && endPoint.parameters.length > 0)) {
                return this.endpoints[i];
            }
        }
        return null;
    };
}
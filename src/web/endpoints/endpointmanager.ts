import {EndPoint} from "./endpoint";

export class EndPointManager {

    private static instance: EndPointManager;

    //Variables:
    public endpoints: Array<EndPoint> = [];

    private constructor() {
        this.init();
    }

    static getInstance = (): EndPointManager => {
        if (!EndPointManager.instance) {
            EndPointManager.instance = new EndPointManager();
        }
        return EndPointManager.instance;
    };

    private init = () => {

    };

    public registerEndpoint = (endpoint: EndPoint): void => {
        this.endpoints.push(endpoint);
    };

    public getEndpoints = (): Array<EndPoint> => {
        return this.endpoints;
    };

    public getEndpoint = (path: string): EndPoint => {
        for(let i = 0; i < this.endpoints.length; i++) {
            let endPoint: EndPoint = this.endpoints[i];

            if(endPoint.path == path || (endPoint.path + '/' == path && endPoint.parameters.length > 0)) {
                return this.endpoints[i];
            }
        }
        return null;
    };
}
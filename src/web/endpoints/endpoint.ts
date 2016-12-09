import {Parameter} from "./parameters/parameter";

export class EndPoint<T, P, Q> {

    public path:        string;
    private executor:   Function; //Or use : '() => void'
    public parameters:  Array<Parameter<T, P, Q>>;

    constructor(path: string, executor: Function, parameters: Array<Parameter<T, P, Q>>) {
        this.path = path;
        this.executor = executor;
        this.parameters = parameters != null ? parameters : [];
    }

    public execute(request, response): void {
        this.executor(request, response, this.parameters);
    }
}
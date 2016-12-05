import {Parameter} from "./parameters/parameter";

export class EndPoint {

    public path:        string;
    private executor:   Function; //Or use : '() => void'
    public parameters:  Array<Parameter>;

    constructor(path: string, executor: Function, parameters: Array<Parameter>) {
        this.path = path;
        this.executor = executor;
        this.parameters = parameters != null ? parameters : [];
    }

    public execute(request, response): void {
        this.executor(request, response, this.parameters);
    }
}
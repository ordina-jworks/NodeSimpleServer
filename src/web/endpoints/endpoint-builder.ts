import { EndpointDefinition } from "./endpoint-definition";
import { HttpMethod } from "../http-method";
import { Parameter } from "./parameters/parameter";

export class EndpointBuilder {

    private _path: string;
    private _method: HttpMethod;
    private _parameters: Array<Parameter<any>>;

    private _authenticationRequired: boolean;
    private _roles: string[];

    private _executor: Function;

    public constructor() {
        this.resetState();
    }

    public path(path: string): EndpointBuilder {
        this._path = path;
        return this;
    }

    public method(method: HttpMethod): EndpointBuilder {
        this._method = method;
        return this;
    }

    public parameters(parameters: Array<Parameter<any>>): EndpointBuilder {
        this._parameters = parameters;
        return this;
    }

    public requiresAuthentication(requiresAuthentication: boolean): EndpointBuilder {
        this._authenticationRequired = requiresAuthentication;
        return this;
    }

    public roles(roles: string[]): EndpointBuilder {
        this._roles = roles;
        return this;
    }

    public executor(executor: Function): EndpointBuilder {
        this._executor = executor;
        return this;
    }

    public build(): EndpointDefinition {
        if (this._path && this._executor) {
            if (this._authenticationRequired && (!this._roles && this.roles.length == 0)) {
                console.error('If requiresAuthentication is set to true, the roles have to be set too!');
                return null;
            } else {
                let endpoint: EndpointDefinition = new EndpointDefinition();
                endpoint.path = this._path;
                endpoint.method = this._method;
                endpoint.parameters = this._parameters;
                endpoint.requiresAuthentication = this._authenticationRequired;
                endpoint.roles = this._roles;
                endpoint.executor = this._executor;

                this.resetState();

                return endpoint;
            }
        } else {
            console.error('Both the path and executor should be set before calling the build method!');
            return null;
        }
    }

    private resetState(): void {
        this._path = null;
        this._method = HttpMethod.GET;
        this._parameters = [];
        this._authenticationRequired = false;
        this._roles = [];
        this._executor = null;
    }
}
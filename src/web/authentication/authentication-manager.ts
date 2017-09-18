import {IncomingMessage}    from "http";
import {EndpointDefinition} from "../endpoints/endpoint-definition";
import {Config}             from "../../../resources/config";

export class AuthenticationManager {

    private static instance: AuthenticationManager  = null;

    private config: Config                          = null;

    /**
     * Private constructor for the singleton.
     */
    private constructor() {
        this.config = Config.getInstance();
    }

    /**
     * Use this method to get the instance of this singleton class.
     *
     * @returns {AuthenticationManager} The instance of this singleton class.
     */
    static getInstance = (): AuthenticationManager => {
        if (!AuthenticationManager.instance) {
            AuthenticationManager.instance = new AuthenticationManager();
        }
        return AuthenticationManager.instance;
    };

    /**
     * Authenticates the given request for the matching endpoint!
     * If no authentication is required will act like it is authenticated and return true!
     * Will return false if authentication is required and not present, incorrect or does not have the required access rights (role)
     *
     * @param {"http".IncomingMessage} request
     * @param {EndpointDefinition} endPoint
     * @returns {boolean} True if authenticated, false if not.
     */
    public authenticateForEndpoint(request: IncomingMessage, endPoint: EndpointDefinition): boolean {
        if(endPoint.requiresAuthentication) {
            let auth: string | string[] = request.headers['Authorization'];
            auth = auth == null ? request.headers['authorization'] : auth;

            if(auth) {
                let users: any[] = this.config.auth.users;

                for(let i = 0; i < users.length ; i++) {
                    let user: {user: string, auth: string, roles: string[]} = users[i];

                    if('Basic ' + user.auth == auth) {
                        for(let m = 0; m < endPoint.roles.length; m++) {
                            if(user.roles.indexOf(endPoint.roles[m]) > -1) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
                return false;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
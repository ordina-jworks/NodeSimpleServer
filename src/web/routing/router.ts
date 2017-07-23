import fs           = require('fs');
import mime         = require('mime');
import path         = require('path');

import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Config}             from '../../../resources/config';
import {EndpointDefinition} from "../endpoints/endpoint-definition";
import {EndpointManager}    from "../endpoints/endpoint-manager";
import {HttpMethod}         from "../http-method";

import {HttpMethodEndpointHandler}      from "./http-method-endpoint-handler";
import {HttpGetMethodEndpointHandler}   from "./http-get-method-endpoint-handler";
import {HttpPostMethodEndpointHandler}  from "./http-post-method-endpoint-handler";

/**
 * Router class.
 *
 * This class is used to route HTTP requests.
 * An HTTP Request is either a request for a file or for an endpoint.
 *
 * If the requests requests a file, that file is returned, if it requests and endpoint
 * the endpoint is called.
 */
export class Router {

    private config: Config                      = null;
    private endpointManager: EndpointManager    = null;

    private pathParts: Array<string>            = null;
    private rootFolder: string                  = null;

    private getMethodEndpointHandler: HttpMethodEndpointHandler     = null;
    private postMethodEndpointHandler: HttpMethodEndpointHandler    = null;

    /**
     * Constructor for Router.
     */
    constructor() {
        this.config = Config.getInstance();
        this.endpointManager = EndpointManager.getInstance();

        this.getMethodEndpointHandler = new HttpGetMethodEndpointHandler();
        this.postMethodEndpointHandler = new HttpPostMethodEndpointHandler();

        this.pathParts  = process.argv[1].split(/([/\\])/);
        this.rootFolder = this.pathParts.splice(0, (this.pathParts.length - 3)).join('');
    }

    /**
     * This method is used to route each incoming HTTP request.
     * This method will try to determine if the requests if for a file, an endpoint or to list the folder contents.
     * If the path is not for a file, it will try and retrieve a matching endpoint. If not endpoint can be found
     * it will to list the folder contents (if allowed).
     *
     * @param pathName The path of the requested resource.
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    public route(pathName: string, request: IncomingMessage, response: ServerResponse): void {
        if(Router.isFile(pathName)) {
            this.tryAndServeFile(pathName, response);

        } else {
            let endPoint: EndpointDefinition = this.endpointManager.getEndpoint(pathName);

            if(endPoint != null) {
                this.tryAndHandleRestEndpoint(endPoint, pathName, request, response);
            } else {
                this.listFolderContents(pathName, response);
            }
        }
    };

    /**
     * Method to see if a path points to a (may be a non-existent) file or not.
     * If the path most likely represents a file which may or may not exist true is returned.
     * If the path does not seem to point to a valid file false it returned.
     *
     * @param pathName The path of the requested resource.
     * @returns {boolean} True if a valid filename, false if not.
     */
    private static isFile (pathName: string): boolean {
        let path: string = pathName.replace('/','');
        let isFile: boolean = path.indexOf('.') > -1;
        return isFile && path.search('.') == 0;
    };

    /**
     * This method will try and serve the requested file.
     * If the file cannot be found a 404 error will be generated.
     * If the file is found but cannot be read, a 500 error will be generated.
     *
     * Image file types will have a header set for caching optimisations.
     *
     * @param pathName The path to the requested file.
     * @param response The HTTP Response.
     */
    private tryAndServeFile (pathName: string, response: ServerResponse): void {
        let fullPath = path.normalize(this.rootFolder + '/' + this.config.settings.webContentFolder + pathName);

        //Read and present the file.
        fs.exists(fullPath, (exists) => {
            //If the file does not exist, present a 404 error.
            if(!exists) {
                Router.displayError(response, 404, 'Resource not found!', fullPath);
            } else {
                fs.readFile(fullPath, 'binary', (error, file) => {
                    if(error) {
                        //If there was an error while reading the file, present a 500 error.
                        console.log('Error serving file!', fullPath);

                        Router.displayError(response, 500, 'Error while serving content!', pathName);
                    } else {
                        let cntType = mime.lookup(fullPath);
                        console.log('Serving: ' + fullPath + '\t (' + cntType + ')');

                        //Present the file.
                        response.setHeader('Content-Type', cntType);
                        response.setHeader('Size', file.length + '');

                        //Add caching for images!
                        if(cntType.indexOf('image') > -1) {
                            response.setHeader('Cache-Control', 'max-age=2678400, must-revalidate');
                        }

                        response.writeHead(200);
                        response.write(file, 'binary');
                        response.end();
                    }
                });
            }
        });
    };

    /**
     * This method will try and execute the requested endpoint.
     * It will check the HTTP method of the request and forward to the correct logic for execution.
     *
     * @param endPoint The Endpoint to execute.
     * @param pathName The path of the requested endpoint.
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    private tryAndHandleRestEndpoint (endPoint: EndpointDefinition, pathName: string, request: IncomingMessage, response: ServerResponse): void {
        console.log('Handling REST request: ' + pathName + ' method: ' + request.method);

        switch (HttpMethod.valueOf(request.method)) {
            case HttpMethod.GET:
                this.getMethodEndpointHandler.handleEndpoint(endPoint, pathName, request, response);
                break;
            case HttpMethod.POST:
                this.postMethodEndpointHandler.handleEndpoint(endPoint, pathName, request, response);
                break;
            default:
                console.log('Cannot handle Rest endpoint call with method: ' + request.method);
        }
    };

    /**
     * This method will list the contents of the requested folder.
     * Folder content will only be listed if this is enabled from the configuration.
     * If an error occurs during the listing of the folder contents, a 500 error will be generated.
     * If folder content listing is disabled, a 403 error will be generated.
     *
     * @param pathName The path of the requested folder.
     * @param response The HTTP Response.
     */
    private listFolderContents (pathName: string, response: ServerResponse): void {
        if(this.config.settings.allowFolderListing) {
            let fullPath = path.normalize(this.rootFolder + '/' + this.config.settings.webContentFolder + pathName);

            fs.readdir(fullPath, (err, files) => {
                if(err != null) {
                    console.error(err.message);

                    Router.displayError(response, 500, 'Cannot list folder contents!', pathName);
                    return;
                }

                response.writeHead(200, {'Content-Type': 'application/javascript'});
                response.write(JSON.stringify(files, null, 4));
                response.end();
            });

        } else {
            Router.displayError(response, 403, 'Folder access is forbidden!', pathName);
        }
    };

    /**
     * Returns the HTTP Response with an error code and message.
     *
     * @param response The HTTP Response to write the error to.
     * @param type The type of the error. This is an HTTP status code.
     * @param message The message to display with the given type.
     * @param pathName The path for which the error occurred.
     */
    public static displayError(response: ServerResponse, type:number , message: string, pathName: string): void {
        console.error(message + ' (' + pathName + ')');

        response.writeHead(type, {'Content-Type': 'text/plain'});
        response.write(message);
        response.end();
    };
}
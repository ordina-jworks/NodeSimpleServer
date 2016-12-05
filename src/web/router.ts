import fs           = require('fs');
import mime         = require('mime');
import path         = require('path');
import url          = require('url');

import {IncomingMessage}    from "http";
import {ServerResponse}     from "http";

import {Config}             from '../../resources/config';
import {EndPoint}           from "./endpoints/endpoint";
import {EndPointManager}    from "./endpoints/endpointmanager";
import {Parameter}          from "./endpoints/parameters/parameter";

export class Router {

    private config: Config  = Config.getInstance();

    private endpointManager: EndPointManager     = null;

    private pathParts: Array<string>             = null;
    private rootFolder: string                   = null;

    constructor() {
        this.endpointManager = EndPointManager.getInstance();

        this.pathParts  = process.argv[1].split(/([/\\])/);
        this.rootFolder = this.pathParts.splice(0, (this.pathParts.length - 3)).join('');
    }

    public route = (pathName: string, request: IncomingMessage, response: ServerResponse): void => {
        if(this.isFile(pathName)) {
            this.tryAndServeFile(response, pathName);

        } else {
            let endPoint: EndPoint = this.endpointManager.getEndpoint(pathName);

            if(endPoint != null) {
                this.tryAndHandleRestEndpoint(endPoint, pathName, request, response);
            } else {
                this.listFolderContents(response, pathName);
            }
        }
    };

    private isFile = (pathName: string): boolean => {
        let path = pathName.replace('/','');
        let isFile = path.indexOf('.') > -1;
        return isFile && path.search('.') == 0;
    };

    private tryAndServeFile = (response: ServerResponse, pathName: string): void => {
        let fullPath = path.normalize(this.rootFolder + '/' + this.config.settings.webContentFolder + pathName);

        //Read and present the file.
        fs.exists(fullPath, (exists) => {
            //If the file does not exist, present a 404 error.
            if(!exists) {
                this.displayError(response, 404, 'Resource not found!', fullPath);
            } else {
                fs.readFile(fullPath, 'binary', (error, file) => {
                    if(error) {
                        //If there was an error while reading the file, present a 500 error.
                        console.debug('Error serving file!', fullPath);

                        this.displayError(response, 500, 'Error while serving content!', pathName);
                    } else {
                        let cntType = mime.lookup(fullPath);
                        console.debug('Serving: ' + fullPath + '\t (' + cntType + ')');

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

    private tryAndHandleRestEndpoint = (endPoint: EndPoint, pathName: string, request: IncomingMessage, response: ServerResponse) => {
        let requestData: any = url.parse(request.url, true);

        console.log('Handling REST request: ' + pathName);
        if(requestData.query.length == 0) {
            endPoint.execute(request, response);
        } else {
            let urlParams: Array<any> = requestData.query;

            if(endPoint.parameters.length === Object.keys(urlParams).length) {
                for (let i = 0; i < endPoint.parameters.length; i++) {
                    let param: Parameter = endPoint.parameters[i];
                    param.setValue(urlParams[endPoint.parameters[i].name]);

                    if (!param.validate()) {
                        this.displayError(response, 400, 'Validation failed: ' + param.validator.description(), pathName);
                        return;
                    }
                }

                endPoint.execute(request, response);
            } else {
                this.displayError(response, 400, 'Parameters incorrect => Required: ' + JSON.stringify(endPoint.parameters), pathName);
            }
        }
    };

    private listFolderContents = (response: ServerResponse, pathName: string): void => {
        if(this.config.settings.allowFolderListing) {
            let fullPath = path.normalize(this.rootFolder + '/' + this.config.settings.webContentFolder + pathName);

            fs.readdir(fullPath, (err, files) => {
                if(err != null) {
                    console.error(err.message);

                    this.displayError(response, 500, 'Cannot list folder contents!', pathName);
                    return;
                }

                response.writeHead(200, {'Content-Type': 'application/javascript'});
                response.write(files);
                response.end();
            });

        } else {
            this.displayError(response, 403, 'Folder access is forbidden!', pathName);
        }
    };

    private displayError = (response: ServerResponse, type:number , message: string, pathName: string): void => {
        console.error(message + ' (' + pathName + ')');

        response.writeHead(type, {'Content-Type': 'text/plain'});
        response.write(message);
        response.end();
    };
}
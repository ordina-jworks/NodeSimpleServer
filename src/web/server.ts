import http     = require('http');
import url      = require('url');
import fs       = require('fs');

import {Router}                 from './routing/router';
import {Config}                 from '../../resources/config';

import {IncomingMessage}        from "http";
import {ServerResponse}         from "http";
import {Stats}                  from "fs";

import {MessageManager}         from "../ipc/message-manager";
import {MessageTarget}          from "../ipc/message-target";
import {DataBrokerOperation}    from "../workers/impl/databroker/data-broker-operation";

/**
 * Server class.
 *
 * This class is instantiated for each HTTP_WORKER.
 * It registers the endpoints and handles HTTP requests.
 * The HTTP requests are passed on to the Router instance.
 */
export class Server {

    private config: Config                      = null;
    private messageManager: MessageManager      = null;

    private id: string                          = null;
    private router: Router                      = null;

    /**
     * Constructor for Server.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: string) {
        this.id = workerId;
        this.config = Config.getInstance();
        this.messageManager = MessageManager.getInstance();

        this.mapRestEndpoints();
        this.router = new Router();

        let port: number = this.config.settings.httpPort;
        //Create a http server that listens on the given port. the second param is for making the localhost loopback work.
        http.createServer(this.onRequest).listen(process.env.PORT || port);
        console.log('[WORKER id:' + workerId + '] Server started => Listening at port: ' + (process.env.PORT || port));
    }

    /**
     * Starts the loading of the endpoint classes.
     * Each endpoint class should have a call to the mapEntryPoints() method in its constructor.
     * This will allow for all endpoints to map their entry points on creation.
     */
    private mapRestEndpoints(): void {
        console.log('[WORKER id:' + this.id + '] Scanning for endpoints...');
        this.endpointClassLoader(this.config.settings.endpointScanFolder);
    };

    /**
     * Will create an instance for each endpoint implementation that is found in the path that is provided.
     * The loader will convert the filenames to the classnames. Therefor it is important that the filename and classname math
     * e.g. this-is-a-test-class.js will map to a class with the name ThisIsATestClass.
     *
     * @param pathToScanForEndpoints A string that contains the path to the folder where all endpoint implementations ate located.
     */
    private endpointClassLoader(pathToScanForEndpoints: string): void {
        let files: string[] = this.getFilesInFolder(pathToScanForEndpoints);
        console.log('[WORKER id:' + this.id + '] Endpoints found to map: ' + JSON.stringify(files, null, 4));

        files.forEach((fullFilePath) => {
            //Strip all the path info and get the filename parts by splitting on the dash symbol.
            let filenameParts: string[] = fullFilePath.split('/').pop().split('-');
            //Convert each part of the filename to start with an uppercase letter.
            for(let i: number = 0; i < filenameParts.length; i++) {
                filenameParts[i] = (filenameParts[i].charAt(0).toUpperCase() + filenameParts[i].slice(1));
            }
            //Join the filename back together and remove the .js extension.
            let filename: string = filenameParts.join('');
            filename = filename.slice(0, filename.length - 3);
            //Create an instance of the 'class', remove the 'src/web' from the path and prepend with a dot symbol.
            eval('new (require(".' + fullFilePath.slice(7, fullFilePath.length - 3) + '")).' + filename + '();');
        });
    };

    /**
     * Scans the given path (which is assumed to be a folder) for all javascript files.
     * If a sub folder is encountered it's contents will also be listed.
     * Only files that adhere to the typescript naming convention are taken into account (e.g. this-is-a-test-file.js)
     * Test files (file.test.ts/file.test.js) and files with extensions other than .js are ignored.
     *
     * @param path The path of the folder for which all files (including ones in sub folders) should be listed.
     * @returns {string[]} An array of strings in which each item represents a single file prepended with the path.
     */
    private getFilesInFolder(path: string): string[] {
        let files: string[] = [];

        let items: string[] = fs.readdirSync(path);
        //Go over all the items in the folder.
        items.forEach((item: string) => {
            let stats: Stats = fs.statSync(path + '/' + item);
            //We don't want to list folders, but go in them recursively and scan for more files.
            if(stats.isDirectory()) {
                this.getFilesInFolder(path + item).forEach((file) => {
                    files.push(file);
                });
            } else if(item.split('.').length == 2 && item.indexOf('.js') == item.length - 3){
                //We only add files that have one dot symbol in their name and end on the .js extension.
                //This will ignore any other files (or unit tests)
                files.push((path + '/' + item).replace('//', '/'));
            }
        });

        return files;
    };

    /**
     * Handler method for HTTP requests.
     * Is called for each HTTP request that has been received and assigned to this HTTPWorker/Server instance.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     */
    private onRequest = (request: IncomingMessage, response: ServerResponse): void => {
        let pathName: string = url.parse(request.url).pathname;

        let requestLine: string = '[WORKER id:' + this.id + '] IP: ' + request.connection.remoteAddress + ' \t-> requested: ' + pathName;
        console.log(requestLine);
        this.messageManager.sendMessage({
            'cacheName' : 'requests',
            'key' : process.hrtime()[1] + '-' + this.id + '-' + request.connection.remoteAddress,
            'value' : requestLine
        }, MessageTarget.DATA_BROKER, DataBrokerOperation.SAVE + "");

        this.router.route(pathName, request, response);
    };
}
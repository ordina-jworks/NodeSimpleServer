import {IncomingMessage, ServerResponse} from "http";
import {Parameter} from "./parameters/parameter";

/**
 * Base class for and endpoint implementations.
 */
export abstract class BaseEndpoint {

    /**
     * Maps the entry points for this endpoint.
     * This method should be called from the constructor!
     */
    public abstract mapEntryPoints: Function;

    /**
     * Gets the parameter by name. Checks the array of available parameters, if a name match is found, that match is returned.
     * If no match is found, null is returned.
     *
     * @param {string} parameterName The name of the parameter to find.
     * @param {Array<Parameter<any>>} parameters The array of the available parameters.
     * @returns {Parameter<any>} The matching parameter if found, null if not.
     */
    public getParameterByName (parameterName: string, parameters: Array<Parameter<any>>): Parameter<any> {
        for (let i: number = 0; i < parameters.length; i++) {
            let parameter: Parameter<any> = parameters[i];

            if(parameter.name == parameterName) {
                return parameter;
            }
        }
        return null;
    }

    /**
     * Parses the payload which should be a JSON message.
     *
     * @param request The request on which the payload is received.
     * @param response The response object on which the respond should be written.
     * @param callback The callback function that should be executed when the data has been processed.
     */
    public parsePayload (request: IncomingMessage, response: ServerResponse, callback: Function): void {
        let data: {} = null;
        let fullBody: string = '';

        request.on('data', (chunk) => {
            fullBody += chunk.toString();
        });

        request.on('end', () => {
            try {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                data = JSON.parse(fullBody);
            } catch (error) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write('Cannot parse request body! Make sure that it is proper JSON!');
            }
            response.end();

            callback(data);
        });
    }

    /**
     * Basic respond method. Can be used to write a reponse and send it to the client.
     *
     * @param response The response object on which the respond should be written.
     * @param statusCode The HTML status code for the response to have.
     * @param payload The payload that will be contained withing the response.
     * @param formatAsJSON True if the payload should be JSON formatted, false if not.
     * @param contentType The content type for the payload to have when it is sent back to the client.
     */
    public respond (response: ServerResponse, statusCode: number, payload: {}, formatAsJSON: boolean, contentType: string): void {
        response.writeHead(statusCode, {'Content-Type': contentType});
        if(formatAsJSON) {
            response.write(JSON.stringify(payload, null, 4));
        } else {
            response.write(payload + '');
        }
        response.end();
    }

    /**
     * Specific respond method. Used to respond with the 200 - OK HTTP response code.
     *
     * @param response The response object on which the respond should be written.
     * @param payload The payload that will be contained withing the response.
     * @param formatAsJSON True if the payload should be JSON formatted, false if not. (defaults to true)
     * @param contentType The content type for the payload to have when it is sent back to the client. (defaults to json)
     */
    public respondOK (response: ServerResponse, payload: {}, formatAsJSON: boolean = true, contentType: string = 'application/json'): void {
        BaseEndpoint.prototype.respond(response, 200, payload, formatAsJSON, contentType);
    }

    /**
     * Specific respond method. Used to respond with the 500 - Server Error HTTP response code.
     *
     * @param response The response object on which the respond should be written.
     * @param payload The payload that will be contained withing the response.
     * @param formatAsJSON True if the payload should be JSON formatted, false if not. (defaults to true)
     * @param contentType The content type for the payload to have when it is sent back to the client. (defaults to json)
     */
    public respondServerError (response: ServerResponse, payload: {}, formatAsJSON: boolean = true, contentType: string = 'application/json'): void {
        BaseEndpoint.prototype.respond(response, 500, payload, formatAsJSON, contentType);
    }

    /**
     * Specific respond method. Used to respond with the 404 - Resource Not Found HTTP response code.
     *
     * @param response The response object on which the respond should be written.
     * @param payload The payload that will be contained withing the response.
     * @param formatAsJSON True if the payload should be JSON formatted, false if not. (defaults to false)
     * @param contentType The content type for the payload to have when it is sent back to the client. (defaults to plain text)
     */
    public respondNotFound (response: ServerResponse, payload: {}, formatAsJSON: boolean = false, contentType: string = 'text/plain'): void {
        BaseEndpoint.prototype.respond(response, 404, payload, formatAsJSON, contentType);
    }

    /**
     * Used to redirect the client to a different location or resource.
     *
     * @param response The response object on which the respond should be written.
     * @param target The target to redirect the client to.
     */
    public redirect(response: ServerResponse, target: string): void {
        response.writeHead(301, {
            'Location' : target
        });
        response.end();
    }
}
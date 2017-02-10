import {ServerResponse} from "http";

/**
 * Base class for and endpoint implementations.
 */
export abstract class BaseEndpoint {

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
        this.respond(response, 200, payload, formatAsJSON, contentType);
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
        this.respond(response, 500, payload, formatAsJSON, contentType);
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
        this.respond(response, 404, payload, formatAsJSON, contentType);
    }

    /**
     * Used to redirect the client to a different location or resource.
     *
     * @param response The response object on which the respond should be written.
     * @param target The target to redirect the client to.
     */
    public redirect(response: ServerResponse, target: string): void {
        response.writeHead(301, {
            "Location" : "/welcome/index.html"
        });
        response.end();
    }
}
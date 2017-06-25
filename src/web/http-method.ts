/**
 * Enum class that defines the HTTP methods used in the application.
 */
export enum HttpMethod {
    GET,
    POST,
    PUT,
    DELETE,
    OPTIONS
}

export namespace HttpMethod {

    /**
     * Converts the given string value to an instance of the HttpMethod enum.
     *
     * @param method The HTTP method represented as a string. Will convert the given string to uppercase before matching.
     * @returns {HttpMethod} The enum instance that matches with the given text string or null if no match was found.
     */
    export function valueOf(method: string): HttpMethod {
        if(!method) {
            return null;
        }

        switch (method.toUpperCase()) {
            case 'GET':
                return HttpMethod.GET;
            case 'POST':
                return HttpMethod.POST;
            case 'PUT':
                return HttpMethod.PUT;
            case 'DELETE':
                return HttpMethod.DELETE;
            case 'OPTIONS':
                return HttpMethod.OPTIONS;
            default:
                return null;
        }
    }
}
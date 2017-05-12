import {IncomingMessage, ServerResponse} from "http";

import {BaseEndpoint}                   from "../../base-endpoint";
import {EndpointManager}                from "../../endpoint-manager";
import {EndpointDefinition}             from "../../endpoint-definition";
import {Parameter}                      from "../../parameters/parameter";
import {StringNotEmptyValidatorImpl}    from "../../parameters/impl/string-not-empty-validator-impl";
import {OpenWeatherMap}                 from "../../../../weather/openweathermap";
import {Buienradar}                     from "../../../../weather/buienradar";
import {Blitzortung}                    from "../../../../weather/blitzortung";

/**
 * Class containing all the endpoints for the WeatherGenie application.
 * All methods in this class should be static and no state should be kept!
 */
export class WeatherEndpoint extends BaseEndpoint {

    private buienradar: Buienradar          = null;
    private blitzortung: Blitzortung        = null;
    private openweathermap: OpenWeatherMap  = null;

    /**
     * Constructor for the ArduinoEndpoint class.
     */
    constructor() {
        super();

        this.openweathermap = new OpenWeatherMap();
        this.buienradar = new Buienradar();
        this.blitzortung = new Blitzortung();

        this.mapEntryPoints();
    }

    public mapEntryPoints = (): void => {
        let endpointManager: EndpointManager = EndpointManager.getInstance();
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/weather',
                this.index.bind(this)
            )
        );

        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/weather/data',
                this.getWeatherForCity.bind(this),
                [new Parameter<string>('city', 'string field containing the name of the city', new StringNotEmptyValidatorImpl())]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/weather/rainForCoords',
                this.getRainForCoords.bind(this),
                [
                    new Parameter<number>('latitude', 'The latitude part of the coordinates'),
                    new Parameter<number>('longitude', 'the longitude part of the coordinates')
                ]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/weather/rainForXY',
                this.getRainForBlock.bind(this),
                [
                    new Parameter<number>('x', 'The x-block part of the coordinates'),
                    new Parameter<number>('y', 'the y-block part of the coordinates')
                ]
            )
        );
        endpointManager.registerEndpoint(
            new EndpointDefinition(
                '/weather/lightningForCoords',
                this.getLightningForCoords.bind(this),
                [
                    new Parameter<number>('latitude', 'The latitude part of the coordinates'),
                    new Parameter<number>('longitude', 'the longitude part of the coordinates')
                ]
            )
        );

    };

    /**
     * Endpoint handler that reroutes to the index page of the welcome application.
     * This allows the root / endpoint to point to the web page, so index.html can be omitted.
     *
     * @param request The HTTP Request.
     * @param response The HTTP Response.
     * @param params An array containing the parameters for the endpoint with the desired generic types as defined.
     */
    public index = (request: IncomingMessage, response: ServerResponse, params: [Parameter<null>]): void => {
        console.log('index endpoint called!');

        super.redirect(response, '/weather/index.html');
    };

    public getWeatherForCity = (request: IncomingMessage, response: ServerResponse, params: [Parameter<string>]): void => {
        console.log('getWeatherForCity endpoint called!');

        this.openweathermap.retrieveWeatherInfo(params[0].getValue(), (data) => {
            this.buienradar.geographicConditionForecast(data.placeName, (data2) => {
                if(!data || !data2) {
                    super.respondServerError(response, {ERROR: 'Data could not be retrieved!'})
                } else {
                    data.predictions = data2.days;
                    super.respondOK(response, data);
                }
            });
        });
    };

    public getRainForCoords = (request: IncomingMessage, response: ServerResponse, params: [Parameter<number>]): void => {
        console.log('getRainForCoords endpoint called!');

        this.buienradar.geographicPrediction(params[0].getValue(), params[1].getValue(), (result) => {
            super.respondOK(response, result);
        });
    };

    public getRainForBlock = (request: IncomingMessage, response: ServerResponse, params: [Parameter<number>]): void => {
        console.log('getRainForBlock endpoint called!');

        this.buienradar.geographicPredictionForBlock(params[0].getValue(), params[1].getValue(), (result) => {
            super.respondOK(response, result);
        });
    };

    public getLightningForCoords = (request: IncomingMessage, response: ServerResponse, params: [Parameter<number>]): void => {
        console.log('getLightningForCoords endpoint called!');

        this.blitzortung.lightningData(params[0].getValue(), params[1].getValue(), (result) => {
            super.respondOK(response, result);
        });
    };
}
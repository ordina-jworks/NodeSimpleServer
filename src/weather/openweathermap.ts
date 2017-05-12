import * as http from 'http';

import {MessageManager}         from '../ipc/message-manager';
import {MessageTarget}          from '../ipc/message-target';
import {DataBrokerOperation}    from '../workers/impl/databroker/data-broker-operation';
import {Config}                 from '../../resources/config';

/**
 * TODO: Clean up and correct comments!
 */
export class OpenWeatherMap {

    private config: Config                  = null;

    /**
     * Constructor for the GenericEndpoints class.
     */
    constructor() {
        this.config = Config.getInstance();
    }

    /**
     * Retrieves the remote weather via the openweathermap api.
     * This will partially be handled by the 'retrieveWeatherInfoMessageHandler' function.
     *
     * @param placeName The name of the place the weather info should be retrieved for. (Belgian cities only)
     * @param callback The callback function to execute when done.
     */
    public retrieveWeatherInfo(placeName: string, callback: Function): void {
        console.log('executing retrieveWeatherInfo param: ' + placeName);

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : 'weather_openweathermap', 'key': placeName},
            (msg) => {
                if(msg.payload) {
                    callback(msg.payload);
                } else {
                    this.getRemoteWeather('BE', placeName, callback);
                }

            }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE + ''
        );
    }

    /**
     * Retrieves the remote weather via the openweathermap api.
     *
     * @param countryCode The two char ISO country code.
     * @param placeName The name of the city.
     * @param callback The callback that should be called with the retrieved info.
     */
    private getRemoteWeather(countryCode: string, placeName: string, callback: Function): void {
    console.log('Retrieving weather info from remote service...');

    const options = {
        hostname: 'api.openweathermap.org',
        port: 80,
        path: '/data/2.5/weather?q=' + placeName + ',' + countryCode + '&appid=' + this.config.keys.openweatherMapApiKey,
        method: 'POST'
    };

    http.request(options, function(res) {
        let data: any = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            let info: any = {};
            try {
                data = JSON.parse(data);
            } catch(error) {
                info.error = data.message;
                callback(info);
                return;
            }

            //Check for errors in the data that has been returned.
            if(data.cod >= 400) {
                console.error('Error: ' + data.cod + ' details: ' + data.message);
                info.error = data.message;
                callback(info);
                return;
            }

            info.id = data.id;
            info.placeName = placeName;
            info.location =  data.name;
            info.latitude = data.coord.lat;
            info.longitude = data.coord.lon;

            info.sunrise = data.sys.sunrise;
            info.sunset = data.sys.sunset;

            info.avgTemp = data.main.temp  - 273.15;
            info.maxTemp = data.main.temp_max - 273.15;
            info.minTemp = data.main.temp_min - 273.15;
            info.relHumidity = data.main.humidity;
            info.pressure = data.main.pressure;

            info.avgWindSpeed = data.wind.speed;
            info.avgWindDirectionDegree = data.wind.deg;
            info.avgWindDirectionCardinal = OpenWeatherMap.convertToCardinalWindDirection(info.avgWindDirectionDegree);

            info.conditions = [];
            for(let i: number = 0; i < data.weather.length ; i++) {
                let weather = data.weather[i];

                let condition: any = {};
                condition.id = weather.id;
                condition.icon = weather.icon;
                condition.main = weather.main;
                condition.description = weather.description;

                info.conditions.push(condition);
            }
            info.error = null;
            info.timestamp = new Date();

            MessageManager.getInstance().sendMessage({
                'cacheName' : 'weather_openweathermap',
                'key' : placeName,
                'value' : info
            }, MessageTarget.DATA_BROKER, DataBrokerOperation.SAVE + '');

            callback(info);
        });
    }).end();
}

    /*-------------------------------------------------------------------------------------------------
     *                                         Helper functions
     ------------------------------------------------------------------------------------------------*/
    /**
     * Converts a given degree angle (0-360°) to a String based cardinal direction.
     *
     * @param degrees The angle given in range of: [0,360]
     * @return A String representing the cardinal direction.
     */
    private static convertToCardinalWindDirection(degrees: number): string {
        let cardinalDirection: string = null;

        if(degrees >= 0 && degrees < 11) {
            cardinalDirection = 'N';
        } else if(degrees >= 11 && degrees < 34) {
            cardinalDirection = 'NNE';
        } else if(degrees >= 34 && degrees < 56) {
            cardinalDirection = 'NE';
        } else if(degrees >= 56 && degrees < 79) {
            cardinalDirection = 'ENE';
        } else if(degrees >= 79 && degrees < 101) {
            cardinalDirection = 'E';
        } else if(degrees >= 101 && degrees < 124) {
            cardinalDirection = 'ESE';
        } else if(degrees >= 124 && degrees < 146) {
            cardinalDirection = 'SE';
        } else if(degrees >= 146 && degrees < 169) {
            cardinalDirection = 'SSE';
        } else if(degrees >= 169 && degrees < 191) {
            cardinalDirection = 'S';
        } else if(degrees >= 191 && degrees < 214) {
            cardinalDirection = 'SSW';
        } else if(degrees >= 214 && degrees < 236) {
            cardinalDirection = 'SW';
        } else if(degrees >= 236 && degrees < 259) {
            cardinalDirection = 'WSW';
        } else if(degrees >= 259 && degrees < 281) {
            cardinalDirection = 'W';
        } else if(degrees >= 281 && degrees < 304) {
            cardinalDirection = 'WNW';
        } else if(degrees >= 304 && degrees < 326) {
            cardinalDirection = 'NW';
        } else if(degrees >= 326 && degrees < 349) {
            cardinalDirection = 'NNW';
        } else if(degrees >= 349 && degrees < 361) {
            cardinalDirection = 'N';
        } else {
            console.error('Given direction in degrees should be in range of: [0,360]');
        }

        return cardinalDirection;
    }

}
import * as http from "http";

import {MessageManager}         from "../ipc/message-manager";
import {MessageTarget}          from "../ipc/message-target";
import {DataBrokerOperation}    from "../workers/impl/databroker/data-broker-operation";

export class Buienradar {

    private currentRainMap: any      = null;
    private predictRainMap: any      = null;

    /**
     * Makes a prediction based on the given geographic coordinates.
     * This will partially be handled by the 'geographicPredictionMessageHandler' function.
     *
     * @param latitude The latitude position of the caller.
     * @param longitude The longitude position of the caller.
     * @param callback The callback function to execute when done.
     */
    public geographicPrediction(latitude: number, longitude: number, callback: Function): void {
        console.log('executing: geographicPrediction params: ' + latitude + ',' + longitude);

        let coordinates: {x: number, y:number} = this.convertLatLonToXY(latitude, longitude);
        let x: number = coordinates.x;
        let y: number = coordinates.y;

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : 'weather_rainmap', 'key': (x + '-' + y)},
            (msg) => {
                if(msg.payload) {
                    this.currentRainMap = msg.payload.currentRainMap;
                    this.predictRainMap = msg.payload.predictRainMap;

                    let current = this.currentWeather(x,y);
                    let predict = this.comingWeather(x,y);

                    callback({currentConditions: current, predictedConditions: predict});
                } else {
                    callback({ERROR: 'No rain maps available!'});
                }

            }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE + ''
        );
    }

    /**
     * Makes a prediction based on the given X/Y block coordinates.
     * This will partially be handled by the 'geographicPredictionForBlockMessageHandler' function.
     *
     * @param x The x position of the caller.
     * @param y The y position of the caller.
     * @param callback The callback function to execute when done.
     */
    public geographicPredictionForBlock(x: number, y: number, callback: Function): void {
        console.log('executing: geographicPredictionForBlock(' + x + ', ' + y + ')');

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : 'weather_rainmap', 'key': (x + '-' + y)},
            (msg) => {
                if(msg.payload) {
                    this.currentRainMap = msg.payload.currentRainMap;
                    this.predictRainMap = msg.payload.predictRainMap;

                    let current = this.currentWeather(x, y);
                    let predict = this.comingWeather(x, y);

                    callback({currentConditions: current, predictedConditions: predict});
                } else {
                    callback({ERROR: 'No rain maps available!'});
                }

            }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE + ''
        );
    }

    /**
     * Will do a weather condition forecast (not just rain data) for the given city.
     * First the location id for the given city will be sought, then the daily forecast will be retrieved.
     *
     * @param placeName The name of the city to do the forecast for (Belgian cities only).
     * @param callback The callback function to execute when done.
     */
    public geographicConditionForecast(placeName: string, callback: Function): void {
        console.log('executing: geographicConditionForecast param:' + placeName);

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : 'weather_buienradar', 'key': placeName},
            (msg) => {
                if(msg.payload) {
                    callback(msg.payload);
                } else {
                    this.retrieveLocationIdForCity(placeName, (locationId) => {
                        this.retrieveDailyForecast(placeName, locationId, callback);
                    });
                }

            }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE + ''
        );
    }

    /**
     * Converts the given data which contains a gif with frames to rain intensity information per block.
     *
     * @param data The image data to process. contains the data of a processed gif image.
     * @returns {{frames: number, imageWidth: number, imageHeight: number, xBlocks: number, yBlocks: number, data: Array}}
     */
    public convertImageToRainMap (data): any {
        //data.shape is an array => 0:Frames - 1:Width - 2:Height - 3:Channels
        let numberOfFrames = data.shape[0];
        let bytesPerPixel = data.shape[3];
        let pixelsPerFrame = data.shape[1] * data.shape[2];
        let pixelsPerRow = data.shape[1];

        let xBlockWidth = 10;
        let yBlockHeight = 8;
        let xBlocks = data.shape[1] / xBlockWidth;
        let yBlocks = data.shape[2] / yBlockHeight;

        //Convert raw pixel data to raining data at pixel coordinates (this reduces data size by four -> RGBA to raining intensity)
        let pixelRainingData = [];
        for(let colors = 0 ; colors < data.data.length; colors += bytesPerPixel) {
            pixelRainingData.push(this.isRaining(data.data[colors], data.data[colors + 1], data.data[colors + 2]));
        }
        delete data.data;

        //Convert the array of all raining data to an array of arrays, where each secondary array holds all the raining data for one frame.
        let frameRainingData = [];
        for(let currentFrame = 0 ; currentFrame < numberOfFrames ; currentFrame++) {
            frameRainingData.push(pixelRainingData.slice(currentFrame * pixelsPerFrame, currentFrame * pixelsPerFrame + pixelsPerFrame));
        }
        //delete pixelRainingData;

        //Calculate raining intensity for every block!
        //This further reduces the data from raining intensity per pixel location to raining intensity per block location (pixelRainingData.length/xBlocks*yBlocks)
        let blockData = [];
        //Loop over the main blocks (X/Y)
        for(let currentYBlock = 0 ; currentYBlock < yBlocks ; currentYBlock++) {
            for(let currentXBlock = 0 ; currentXBlock < xBlocks ; currentXBlock++) {

                //Loop over the current block its pixels.
                let startXPixel = (currentXBlock * xBlockWidth) + (currentYBlock * yBlockHeight * pixelsPerRow);

                let framedPixels = [];
                for(let currentFrame = 0 ; currentFrame < numberOfFrames ; currentFrame++) {
                    let blockPixels = [];
                    for(let rowIndex = 0 ; rowIndex < yBlockHeight ; rowIndex++) {
                        //Loop over the current block row.
                        for(let columnInRowIndex = 0 ; columnInRowIndex < xBlockWidth ; columnInRowIndex++) {
                            //Offset for block height by adding a full row worth of pixels to the startXPixel+i
                            //This gives us the same location but one row below the current.
                            blockPixels.push(frameRainingData[currentFrame][(rowIndex * pixelsPerRow) + startXPixel + columnInRowIndex]);
                        }
                    }
                    framedPixels.push(blockPixels);
                    //delete blockPixels;
                }
                //delete startXPixel;

                //Loop over all frames.
                let timeData = [];
                for(let currentFrame = 0 ; currentFrame < numberOfFrames ; currentFrame++) {

                    let totalBlockRainingIntensity = 0;
                    let blockPixels = framedPixels[currentFrame];

                    //Loop over all the pixels in the block and find out the highest rain intensity.
                    for(let i = 0 ; i < blockPixels.length ; i++) {
                        //Bring over the intensity only if it is higher than what was already found before.
                        if(blockPixels[i] > totalBlockRainingIntensity) {
                            totalBlockRainingIntensity = blockPixels[i];
                        }
                    }
                    timeData.push(totalBlockRainingIntensity);
                    //delete blockPixels;
                }

                blockData.push({x: currentXBlock, y: currentYBlock, data: timeData});
                //delete timeData;
            }
        }
        return {frames: numberOfFrames, imageWidth: data.shape[1], imageHeight: data.shape[2], xBlocks: xBlocks, yBlocks: yBlocks, data:blockData};
    }

    /**
     * Retrieves the location id for the given city.
     * Will call the callback with null as data if no location id can be found or an error occurred.
     *
     * @param city The city for which the location id should be found.
     * @param callback The callback function to execute when done.
     */
    private retrieveLocationIdForCity(city, callback): void {
        const options = {
            hostname: 'api.buienradar.nl',
            port: 80,
            path: '/data/search/1.0/?query=' + encodeURI(city) + '&country=BE&locale=nl-BE',
            method: 'POST'
        };

        http.request(options, function(res) {
            let data: any = '';
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                if(this.statusCode !== 200) {
                    console.error('Cannot find location id for: ' + city);
                    callback(null);
                } else {
                    //logger.DEBUG(data);
                    data = JSON.parse(data);

                    if(data.length !== undefined && data.length > 0) {
                        let pieces = data[0].results[0].uri.split('/');
                        callback(pieces[pieces.length - 1]);
                    } else {
                        console.error('Cannot find location id for: ' + city);
                        callback(null);
                    }
                }
            });
        }).end();
    }

    /**
     * Retrieves the daily forecasts for the given location id.
     * Will call the callback with null as data if no forecast was found or an error occurred.
     * Forecasts are limited to the 5 first days!
     *
     * @param city The name of the city that was searched for.
     * @param locationId The location id of the city for which we want the daily forecasts.
     * @param callback The callback to execute with the retrieved data.
     */
    private retrieveDailyForecast(city: string, locationId: any, callback: Function): void {
        const options = {
            hostname: 'api.buienradar.nl',
            port: 80,
            path: '/data/forecast/1.1/all/' + locationId,
            method: 'POST'
        };

        http.request(options, function(res) {
            let data: any = '';
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                if(this.statusCode !== 200) {
                    console.error('No daily forecast found for city with id: ' + locationId);
                    callback(null);
                } else {
                    //logger.DEBUG(data);
                    data = JSON.parse(data);

                    if(data.days !== undefined && data.days.length > 0) {
                        data['city'] = city;
                        data['timestamp'] = new Date();
                        //Only return the five first days!
                        data.days = data.days.splice(0, 5);

                        MessageManager.getInstance().sendMessage({
                            'cacheName' : 'weather_buienradar',
                            'key' : city,
                            'value' : data
                        }, MessageTarget.DATA_BROKER, DataBrokerOperation.SAVE + '');

                        callback(data);
                    } else {
                        console.error('No daily forecast found for city with id: ' + locationId);
                        callback(null);
                    }
                }
            });
        }).end();
    }

    /**
     * Gets the current weather from the buienradar retrieved data.
     *
     * @param x x-coordinate.
     * @param y y-coordinate.
     */
    private currentWeather(x: number, y: number): any {
        let loc: any = this.convertXYToBlock(x, y, true);
        for(let i = 0 ; i < this.currentRainMap.data.length ; i++) {
            let block = this.currentRainMap.data[i];
            if(block.x === loc.blockX && block.y === loc.blockY) {
                return this.formatBlockData(block, false);
            }
        }
    }

    /**
     * Gets the coming weather (2 hour prediction) from the buienradar retrieved data.
     *
     * @param x x-coordinate.
     * @param y y-coordinate.
     */
    private comingWeather(x: number, y: number): any {
        let loc: any = this.convertXYToBlock(x, y, false);
        for(let i = 0 ; i < this.predictRainMap.data.length ; i++) {
            let block = this.predictRainMap.data[i];
            if(block.x === loc.blockX && block.y === loc.blockY) {
                return this.formatBlockData(block, true);
            }
        }
    }

    /**
     * Formats the raw rain data in a more comprehensive way.
     *
     * @param block The raw data to format.
     * @param addToTime If true add time to 'now', if false, subtract it.
     * @returns {{x: number, y:number, data:Array}}
     */
    private formatBlockData(block: any, addToTime: boolean): {} {
        let formattedData: any = {};
        formattedData.x = block.x;
        formattedData.y = block.y;
        formattedData.data = [];

        let numberOfFrames = block.data.length;
        for(let currentFrame = 0 ; currentFrame < numberOfFrames ; currentFrame++) {
            if(addToTime) {
                formattedData.data.push({time: '+' + (currentFrame * 10), intensity: block.data[currentFrame]});
            } else {
                formattedData.data.push({time: '-' + (numberOfFrames * 5 - currentFrame * 5), intensity: block.data[currentFrame]});
            }
        }

        return formattedData
    }

    /**
     * For a given latitude and longitude calculate the xy coordinates on the buienradar images.
     *
     * @param lat Latitude in xx,xxxx format.
     * @param lon Longitude in xx,xxxx format.
     * @returns {{x: number, y: number}} x and y coordinates.
     */
    private convertLatLonToXY(lat: number, lon: number): {x: number, y: number} {
        let i = 1, r = 52.5, u = (7 - i) / 550, f = (r - 49.1) / 512, e = Math.round((lon - i) / u), o = Math.round((r - lat) / f);
        return {x: e -5, y: o - 5};
    }

    /**
     * For given coordinates on the image (x/y) return the block coordinates.
     *
     * @param x The pixel x-coordinate.
     * @param y The pixel y-coordinate.
     * @param currentConditions The data that contains the current conditions.
     * @returns {{blockX: number, blockY: number}}
     */
    private convertXYToBlock(x: number, y: number, currentConditions: {}): {} {
        let rainMap = null;
        if(currentConditions === true) {
            rainMap = this.currentRainMap;
        } else {
            rainMap = this.predictRainMap;
        }

        let blockWidth = rainMap.imageWidth / rainMap.xBlocks;
        let blockHeight = rainMap.imageHeight / rainMap.yBlocks;

        let blockX = Math.floor(x / blockWidth);
        let blockY = Math.floor(y / blockHeight);

        return {blockX: blockX, blockY: blockY};
    }

    /**
     * Determines if it is raining based on the pixel colors.
     * Will also determine the intensity. (range 0 -> no rain to 5 -> biblical flood)
     *
     * @param r Red color component.
     * @param g Green color component.
     * @param b Blue color component.
     * @returns intensity: number indicating the rain intensity.
     */
    private isRaining(r: number, g: number, b: number): number {
        let intensity:number = 0;

        if(r > 150 && g < 80 && b > 150) {
            intensity = 5;
        } else if(r > 130 && g < 30 && b < 30) {
            intensity = 4;
        } else if(r < 30 && g < 30 && ((b > 120 && b < 124) || (b > 120 && b > 139))) {
            intensity = 3;
        } else if(r > 70 && r < 120 && g > 70 && g < 140 && b > 200) {
            intensity = 2;
        } else if(r > 125 && g > 150 && b > 150) {
            intensity = 1;
        }
        return intensity;
    }
}
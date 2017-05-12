import WebSocket       = require('ws');

import {MessageManager}         from "../ipc/message-manager";
import {MessageTarget}          from "../ipc/message-target";
import {DataBrokerOperation}    from "../workers/impl/databroker/data-broker-operation";

export class Blitzortung {

    private webSocket: WebSocket    = null;
    private retryCount: number      = 0;
    private socketUrl: string       = null;
    private boundary: string        = "{'west':-12,'east':20,'north':56,'south':33.6}";

    /**
     *
     * @param socketURL
     * @param resetRetryCount
     */
    public setupBlitzortungWebSocket(socketURL: string, resetRetryCount: boolean): void {
        this.socketUrl = socketURL;

        if(resetRetryCount != null && resetRetryCount != undefined) {
            this.retryCount = resetRetryCount ? 0 : this.retryCount;
        }

        //Safety check.
        if(this.retryCount == 0 && this.webSocket != null) {
            this.webSocket.send(this.boundary, (error) => {
                if(error != undefined) {
                    //An error occurred
                    console.error('Connection to blitzortung is in a zombie state, resetting...');
                    this.onWebsocketFailure(null, null);
                }
            });

            console.error('A connection to blitzortung is already open!');
            return;
        } else if(this.retryCount > 5) {
            console.error('Cannot (re)conntect to blitzortung websocket!');
            return;
        }

        this.webSocket = new WebSocket(socketURL + ':808' + this.retryCount, '', {headers: {origin: 'http://www.blitzortung.org'}});
        this.webSocket.on('open', () => {
            console.log('Websocket connection to blitzortung opened!');
            this.retryCount = 0;
            this.webSocket.send(this.boundary);
        });
        this.webSocket.on('message', (data: any, flags: { binary: boolean }) => {
            let strike: any = JSON.parse(data);
            strike['timestamp'] = new Date(Math.floor(strike.time/1000000));

            //Check to see if the strike was in the radius (300km) of the geographic center of Belgium.
            //Only send the strike when in range.
            if(this.getDistanceBetweenTwoLatLonPoints(50.6404438 , 4.66775, strike.lat, strike.lon) <= 300) {
                console.log('Lightning in range received!');

                MessageManager.getInstance().sendMessage({
                    'cacheName' : 'weather_lightning',
                    'key' : strike.lat + '-' + strike.lon,
                    'value' : strike
                }, MessageTarget.DATA_BROKER, DataBrokerOperation.SAVE + '');
            }
        });
        //If the socket goes down restart it!
        this.webSocket.on('close', this.onWebsocketFailure);
        this.webSocket.on('error', this.onWebsocketFailure);
    }

    /**
     * Will retrieve all lightning data, calculate the distance between the caller's position and return the results.
     * This will partially be handled by the 'lightningDataMessageHandler' function.
     *
     * @param lat The latitude position of the caller.
     * @param lon The longitude position of the caller.
     * @param callback The callback function to execute when done.
     */
    public lightningData (lat: number, lon: number, callback: Function) {
    console.log('lightningData method was called!');

        MessageManager.getInstance().sendMessageWithCallback({'cacheName' : 'weather_lightning', 'key': lat + '-' + lon},
            (msg) => {
                if(msg.payload) {
                    let strikes = [];
                    for(let i = 0 ; i < msg.returnData.length ; i++) {
                        let strike = msg.returnData[i];
                        let dist = this.getDistanceBetweenTwoLatLonPoints(lat, lon, strike.lat, strike.lon);
                        strikes.push({
                            timestamp: strike.timestamp,
                            distance: dist
                        });
                    }
                    callback({lat: lat, lon: lon, data: strikes});
                } else {
                    callback({warning: 'No lightning data available!'});
                }

            }, MessageTarget.DATA_BROKER, DataBrokerOperation.RETRIEVE + ''
        );
    }

    /**
     * Executed when the websocket has failed (either close/error events).
     * An attempt will be made to reestablish the connection.
     *
     * @param data The error data.
     * @param flags The error flags.
     */
    private onWebsocketFailure(data: any, flags?: any): void {
        console.error('Websocket failure: ' + JSON.stringify(data) + ' - ' + JSON.stringify(flags));

        //The retryCount acts as the count for retries and as the port number.
        this.retryCount++;
        this.setupBlitzortungWebSocket(this.socketUrl, false);
    }

    /**
     * Calculates the distance in km between to given points in lat/lon
     *
     * @param lat1 Latitude of point 1.
     * @param lon1 Longitude of point 1.
     * @param lat2 Latitude of point 2.
     * @param lon2 Latitude of point 2.
     * @returns {number} The distance between the two points in kilometers.
     */
    private getDistanceBetweenTwoLatLonPoints(lat1: number, lon1: number, lat2: number, lon2: number): number {
        let R: number = 6371;
        let dLat = this.deg2rad(lat2-lat1);
        let dLon = this.deg2rad(lon2-lon1);
        let a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        let d = R * c;
        return d;
    }

    /**
     * Converts degrees to radians.
     *
     * @param deg The number of degrees to convert.
     * @returns {number} The amount of radians.
     */
    private deg2rad(deg: number): number {
        return deg * (Math.PI/180)
    }
}
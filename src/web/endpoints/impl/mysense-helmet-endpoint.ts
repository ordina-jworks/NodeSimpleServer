import {Parameter} from "../parameters/parameter";
import {ServerResponse} from "http";
import {IncomingMessage} from "http";
import {MySenseHelmetDB} from "../../../db/mysense-helmet";
/**
 * Created by ToVB on 6/02/2017.
 */

export class MySenseHelmetEndpoint {
    //static serverKey = 'AAAA--YvPSI:APA91bHl9dt7J6fpJojUuujzt8ffmKtIWGe-P0YRzG4PD68-JfK5JRoa7AXIFb2869qk8-AcXLW1mElbJjGHGuS3YvyVhUDpLwykSt42odln9LHIlLXEq8uFoMwpOyJMXbCimw4gOasA';
    static serverKey = process.env.PN_SERVER_KEY;
    static sensorKey = 'myhelmetsensor2';

    public static sendPushNotification(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean, null, null>>): void {
        console.log('send push ');

        let helmet: MySenseHelmetDB = new MySenseHelmetDB();
        helmet.getSensor(MySenseHelmetEndpoint.sensorKey)
            .then(sensor => {
                console.log('received sensor: ' + JSON.stringify(sensor));
                let FCM = require('fcm-node');
                let fcm = new FCM(MySenseHelmetEndpoint.serverKey);

                let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    registration_ids: sensor.subscriptions,
                    //to: sensor.subscriptions[0],
                    collapse_key: 'accident',

                    data: {
                        title: process.env.PN_TITLE,
                        body: process.env.PN_MESSAGE
                    }
                };

                fcm.send(message, function(err, fcmResponse){
                    if (err) {
                        console.log("Something has gone wrong!" + err);
                        MySenseHelmetEndpoint.sendSucces(response, JSON.stringify({'Error': err}));
                    } else {
                        console.log("Successfully sent with response: " + fcmResponse);
                        MySenseHelmetEndpoint.sendSucces(response, JSON.stringify({status: 'Push notifications have been sent'}));
                    }
                });
            });
    }

    public static registerDevice(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>): void {
        console.log("registerDevice");

        let helmet: MySenseHelmetDB = new MySenseHelmetDB();
        helmet.addSubscription(MySenseHelmetEndpoint.sensorKey, params[0].getValue())
            .then(sensor => {
                console.log('Sensor data updated' + JSON.stringify(sensor));
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify(sensor));
            })
            .catch(err => {
                console.log('error occured: ' + err);
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify({'Error': err}));
            });
    }

    public static unregisterDevice(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<string, null, null>>): void {
        console.log("registerDevice");

        let helmet: MySenseHelmetDB = new MySenseHelmetDB();
        helmet.removeSubscription(MySenseHelmetEndpoint.sensorKey, params[0].getValue())
            .then(sensor => {
                console.log('Sensor data updated' + JSON.stringify(sensor));
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify(sensor));
            })
            .catch(err => {
                console.log('error occured: ' + err);
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify({'Error': err}));
            });
    }

    public static resetSensor(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<null, null, null>>) {
        console.log("Clear sensor");

        let helmet: MySenseHelmetDB = new MySenseHelmetDB();
        helmet.clearSensor(MySenseHelmetEndpoint.sensorKey)
            .then(sensor => {
                console.log('Sensor data cleared' + JSON.stringify(sensor));
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify(sensor));
            })
            .catch(err => {
                console.log('error occured: ' + err);
                MySenseHelmetEndpoint.sendSucces(response, JSON.stringify({'Error': err}));
            });
    }

    private static sendSucces(response: ServerResponse, responseString: string) {
        MySenseHelmetEndpoint.send(response, responseString, 200);
    }

    private static sendFailure(response: ServerResponse, responseString: string) {
        MySenseHelmetEndpoint.send(response, responseString, 400);
    }

    private static send(response: ServerResponse, responseString: string, status: number) {
        response.writeHead(status, {'Content-Type': 'application/json'});
        response.write(responseString);
        response.end();
    }
}
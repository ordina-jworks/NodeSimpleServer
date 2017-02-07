import {Parameter} from "../parameters/parameter";
import {ServerResponse} from "http";
import {IncomingMessage} from "http";
/**
 * Created by ToVB on 6/02/2017.
 */

export class MySenseHelmetEndpoint {
    //static serverKey = 'AAAA--YvPSI:APA91bHl9dt7J6fpJojUuujzt8ffmKtIWGe-P0YRzG4PD68-JfK5JRoa7AXIFb2869qk8-AcXLW1mElbJjGHGuS3YvyVhUDpLwykSt42odln9LHIlLXEq8uFoMwpOyJMXbCimw4gOasA';
    static serverKey = process.env.PN_SERVER_KEY;

    public static sendPushNotification(request: IncomingMessage, response: ServerResponse, params: Array<Parameter<boolean, null, null>>): void {
        console.log('send push ');
        let FCM = require('fcm-node');
        let fcm = new FCM(MySenseHelmetEndpoint.serverKey);

        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            //to: 'eLsGHumbpjM:APA91bHSWGx1RRYA6dOi-sbUkSM_goXBsqTXh6cNKPi8RW29BHNAm7TKmv2MVLQKnljcJZan01O2TJdm5TEG_l1xBmC1JRLxAop1CeR3P4sPX3NxWLfgRrbQnVystn-EDx9aYuc5VEht',
            to: process.env.PN_TO,
            collapse_key: 'accident',

            notification: {
                title: 'Gevallen!!!',
                body: 'Tom is gevallen met de fiets!'
            }
            // ,
            //
            // data: {  //you can send only notification or only data(or include both)
            //     my_key: 'my value',
            //     my_another_key: 'my another value'
            // }
        };

        fcm.send(message, function(err, fcmResponse){
            if (err) {
                console.log("Something has gone wrong!" + err);
                response.writeHead(400, {'Content-Type': 'text/plain'});
                response.write('Failed : ' + err);
                response.end();
            } else {
                console.log("Successfully sent with response: " + fcmResponse);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('Push notification has been sent.');
                response.end();
            }
        });
    }
}
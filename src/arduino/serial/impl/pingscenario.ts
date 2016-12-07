import SerialPort = require("serialport");

import {Scenario}   from "../../scenario";

export class PingScenario implements Scenario {

    private port: SerialPort = null;

    public run = (port: SerialPort): void => {
        this.port = port;
        setTimeout(this.ping, 2000);
    };

    public onMessage = (message: any): void => {
        console.log('Message received: ' + message);
        this.pong(message);
    };

    private ping = (): void => {
        console.log('ping...');

        if(this.port != null) {
            this.port.write('ping');
            this.port.drain(() => {
                console.log('ping written to comm port!');
            });
        } else {
            console.log('No port to write to!');
        }
    };

    private pong = (message: any): void => {
        console.log(message);

        if(message.trim() == 'pong') {
            console.log('Pong received, pinging again in 1sec...');
            setTimeout(() => {
                this.ping();
            }, 1000);
        }
    };
}
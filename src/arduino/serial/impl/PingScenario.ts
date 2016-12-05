import SerialPort = require("serialport");

import {Scenario}   from "../../scenario";

export class PingScenario implements Scenario {

    private port: SerialPort = null;

    public run = (port: SerialPort): void => {
        this.port = port;
        this.ping();
    };

    public onMessage = (message: any): void => {
        console.log('Message received: ' + message);
        this.pong(message);
    };

    private ping = (): void => {
        if(this.port != null) {
            this.port.write('ping');
        } else {
            console.log('No port to write to!');
        }
    };

    private pong = (message: any): void => {
        if(message == 'pong') {
            console.log('Pong received, pinging again in 1sec...');
            setTimeout(() => {

            }, 1000);
        }
    };
}
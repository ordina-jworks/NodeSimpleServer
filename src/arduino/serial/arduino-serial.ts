import SerialPort = require("serialport");

import {Arduino}    from "../arduino";
import {Scenario}   from "../scenario";

/**
 * ArduinoSerial class.
 *
 * Extends the basic Arduino class and interfaces with the Arduino via the regular SerialPort.
 */
export class ArduinoSerial extends Arduino {

    private port:SerialPort     = null;

    private portName:string     = null;
    private baudRate:number     = null;

    /**
     * Constructor for ArduinoSerial.
     *
     * @param portName The name of the port to connect to.
     * @param baudRate The baud rate for the serial port to utilise.
     * @param scenario The Scenario instance that should be executed.
     */
    constructor(portName:string, baudRate: number, scenario: Scenario) {
        super();
        this.portName = portName;
        this.baudRate = baudRate;
        this.scenario = scenario;
    }

    /**
     * This method initialises the serial port connection to the Arduino.
     * It will first print out all available ports for debugging purposes.
     * It will also bind a number of handlers to react to different kind of events.
     */
    public init(): void {
        this.listPorts();

        if(this.portName != null) {
            this.port = new SerialPort(this.portName, {baudRate: this.baudRate});
            this.port.on('open', this.onCommOpen);
            this.port.on('error', this.onCommError);
            this.port.on('data', this.onDataReceived);
        } else {
            console.error('No comm port for Arduino communication!');
        }
    }

    /**
     * Closes and cleans up the serial connection.
     */
    public cleanup(): void {
        if(this.port != null) {
            this.port.close();
            this.port = null;
        }
    }

    /**
     * Method used to list all the available serial ports on the system.
     */
    private listPorts = (): void => {
        let prom: Promise<any> = SerialPort.list();

        prom.then((res) => {
            console.log('----------------------------------------------');
            console.log('----------------------------------------------');
            console.log('Listing comm ports:');
            console.log('----------------------------------------------');

            res.forEach((port) => {
                console.log(port.comName);
                console.log(port.pnpId);
                console.log(port.manufacturer);
                console.log('----------------------------------------------');
            });
            console.log('----------------------------------------------');
        });
        prom.catch((err) => {
            console.log('Cannot fetch list of comm ports!');
        });
    };

    /**
     * Handler that is called when the serial port connection is established.
     */
    private onCommOpen = (): void => {
        if(this.scenario != null) {
            this.scenario.run(this.port);
        } else {
            console.error('No arduino scenario given to run!');
        }
    };

    /**
     * Handler that is called when there is an error with the serial communication or a connection cannot be established.
     *
     * @param error The error that has been generated.
     */
    private onCommError = (error: any): void => {
        console.error('Arduino serial comm error!')
    };

    /**
     * Handler that is called whenever data has been received via the serial port.
     * This data is forwarded to the scenario.
     *
     * @param data The data that has been received.
     */
    private onDataReceived = (data: any): void => {
        if(this.scenario != null) {
            this.scenario.onMessage(data);
        } else {
            console.error('No scenario to pass data to!');
        }
    };
}
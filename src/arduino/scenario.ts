import SerialPort = require("serialport");

import { Board } from "johnny-five";

/**
 * Interface for all Scenario implementations.
 */
export interface Scenario {

    /**
     * Runs the Scenario. Executing the logic contained within.
     *
     * @param dataSource A datasource that can be either a Johnny-Five Board instance or a regular SerialPort.
     */
    run(dataSource: Board | SerialPort): void;

    /**
     * Message handler. receives any messages from the Arduino implementation.
     *
     * @param message The message that has been received. No validation of any kind is performed on this message.
     */
    onMessage(message: any): void
}
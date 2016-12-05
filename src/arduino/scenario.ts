import {Board} from "johnny-five";
import SerialPort = require("serialport");

export interface Scenario {
    run(dataSource: Board|SerialPort): void;
    onMessage(message: any): void
}
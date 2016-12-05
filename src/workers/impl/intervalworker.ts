import {NodeWorker}     from '../nodeworker';
import {Config}         from "../../../resources/config";
import {ArduinoJohnny}  from "../../arduino/johnny-five/arduinojohnny";
import {BlinkScenario}  from "../../arduino/johnny-five/impl/blinkscenario";
import {Arduino}        from "../../arduino/arduino";
import {ArduinoSerial}  from "../../arduino/serial/arduinoserial";
import {PingScenario}   from "../../arduino/serial/impl/PingScenario";

export class IntervalWorker implements NodeWorker {

    workerId: string            = null;

    private interval: number    = null;
    private config: Config      = Config.getInstance();

    constructor(workerId: string) {
        this.workerId = workerId;

        console.log('[id:' + workerId + '] IntervalWorker created');
    }

    public start = (): void => {
        console.log('IntervalWorker starting...');

        this.setupArduino();

        setInterval(this.loop, this.config.settings.intervalTimeoutInSeconds * 1000);
    };

    private setupArduino = (): void => {
        if(this.config.arduino.enableArduino) {

            let arduino: Arduino;
            if(this.config.arduino.useSerialOverJohnnyFive) {
                arduino = new ArduinoSerial(
                    this.config.arduino.serialPortName,
                    this.config.arduino.serialPortBaudRate,
                    new PingScenario()
                );
            } else {
                arduino = new ArduinoJohnny(new BlinkScenario());
            }
            arduino.init();
        } else {
            console.log('Skipping arduino setup, disabled in settings!');
        }
    };

    private loop = (): void => {
        console.log('IntervalWorker loop start...');



        console.log('IntervalWorker loop end!');
    };
}
import {NodeWorker}     from '../nodeworker';
import {Config}         from "../../../resources/config";
import {ArduinoJohnny}  from "../../arduino/johnny-five/arduinojohnny";
import {BlinkScenario}  from "../../arduino/johnny-five/impl/blinkscenario";
import {Arduino}        from "../../arduino/arduino";
import {ArduinoSerial}  from "../../arduino/serial/arduinoserial";
import {PingScenario}   from "../../arduino/serial/impl/pingscenario";
import {MessageHandler} from "../../ipc/messagehandler";
import {MessageTarget}  from "../../ipc/message-target";
import {IPCMessage}     from "../../ipc/ipc-message";
import {MessageManager} from "../../ipc/messagemanager";
import {IPCRequest}     from "../../ipc/ipc-request";

export class IntervalWorker implements NodeWorker {

    workerId: string                = null;

    private interval: number        = null;
    private config: Config          = Config.getInstance();
    private handler: MessageHandler = MessageHandler.getInstance();

    constructor(workerId: string) {
        this.workerId = workerId;
        this.handler.emitter.on(MessageTarget[MessageTarget.INTERVAL_WORKER] + '', this.onMessage);

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

        //TODO: Do recurring things!

        console.log('IntervalWorker loop end!');
    };

    public onMessage = (message: IPCMessage): void => {
        console.log('Intervalworker message received');

        //TODO: Execute function and send reply to the original caller!
        MessageManager.getInstance().sendReply(null, <IPCRequest>message);
    }
}
import socketIO        = require('socket.io');

import Timer            = NodeJS.Timer;
import {clearInterval}  from "timers";
import * as http        from "http";

import {NodeWorker}     from '../node-worker';
import {Config}         from "../../../resources/config/config";
import {ArduinoJohnny}  from "../../arduino/johnny-five/arduino-johnny";
import {BlinkScenario}  from "../../arduino/johnny-five/impl/blink-scenario";
import {Arduino}        from "../../arduino/arduino";
import {ArduinoSerial}  from "../../arduino/serial/arduino-serial";
import {PingScenario}   from "../../arduino/serial/impl/ping-scenario";
import {MessageHandler} from "../../ipc/message-handler";
import {MessageTarget}  from "../../ipc/message-target";
import {IPCMessage}     from "../../ipc/messages/ipc-message";
import {MessageManager} from "../../ipc/message-manager";
import {IPCRequest}     from "../../ipc/messages/ipc-request";


/**
 * IntervalWorker class.
 *
 * This worker is used to perform recurring or asynchronous tasks.
 * It can be used to perform logic at regular intervals and perform communication with an Arduino device.
 */
export class IntervalWorker implements NodeWorker {

    workerId: number                = null;
    handler: MessageHandler         = null;

    private interval: Timer         = null;
    private config: Config          = null;
    private arduino: Arduino        = null;

    //Socket.io does not yet have an up to date type def for TypeScript! This bypasses the TS compiler!
    private sio                     = null;
    //private sio: SocketIO.Server  = null;

    /**
     * Constructor for the IntervalWorker.
     *
     * @param workerId The id of the worker it is bound to.
     */
    constructor(workerId: number) {
        this.workerId = workerId;
        this.config = Config.getInstance();

        this.handler = MessageHandler.getInstance();
        this.handler.emitter.on(MessageTarget[MessageTarget.INTERVAL_WORKER] + '', this.onMessage.bind(this));

        console.log('[WORKER id:' + workerId + '] IntervalWorker created');
    }

    /**
     * Starts the IntervalWorker instance.
     * Sets up the Arduino if enabled and starts the main interval loop.
     */
    public start(): void {
        console.log('[WORKER id:' + this.workerId + '] IntervalWorker starting...');

        this.sio = socketIO(
            http.createServer()
                .listen(process.env.SOCKETPORT || this.config.settings.socketPort)
        );
        this.sio.serveClient(true);

        this.sio
            .origins((origin, callback) => {
                console.log('WS request from: ' + origin +  ' : allowed!');
                callback(null, true)
            })
            .of('/socket')
            .on('connection', (socket: SocketIO.Socket) => {
            console.log(socket.id + ' connected');
            socket.emit('welcome', 'You have successfully connected to the web socket!');

            socket.on('app-event', (data: any) => {
                //TODO: Test this! It seems not to work yet!!!
               console.log('Message received from client:' + data);
            });
        });

        this.setupArduino();
        this.interval = setInterval(this.loop, this.config.settings.intervalTimeoutInSeconds * 1000);
    }

    /**
     * Sets up the connection to the Arduino and starts the desired Arduino Scenario.
     */
    private setupArduino(): void {
        if(this.config.arduino.enableArduino) {

            if(this.config.arduino.useSerialOverJohnnyFive) {
                this.arduino = new ArduinoSerial(
                    this.config.arduino.serialPortName,
                    this.config.arduino.serialPortBaudRate,
                    new PingScenario()
                );
            } else {
                this.arduino = new ArduinoJohnny(new BlinkScenario());
            }
            this.arduino.init();
        } else {
            console.log('Skipping arduino setup, disabled in settings!');
        }
    }

    /**
     * Used to restart the IntervalWorker instance.
     * Can be used to restart all the logic when configuration changes have been made.
     */
    private restart() {
        console.log('[WORKER id:' + this.workerId + '] Restarting IntervalWorker...');

        clearInterval(this.interval);
        if(this.config.arduino.enableArduino && this.arduino) {
            this.arduino.cleanup();
        }

        this.start();
    }

    /**
     * Main interval loop. This method is called periodically to execute logic.
     */
    private loop(): void {
        console.log('IntervalWorker loop start...');

        //Do recurring things!

        console.log('IntervalWorker loop end!');
    };

    /**
     * Broadcasts the given message to all connected clients.
     * The given message can be an object, it will be converted to a json string.
     *
     * @param message The message to broadcast to all connected clients.
     */
    private broadcastMessage(message: any): void {
        console.log('Broadcasting web socket message');
        this.sio.of('/socket').emit('app-event', JSON.stringify(message));
    }

    /**
     * Handler for IPC messages. This method is called when an IPCMessage is received from any other worker.
     *
     * @param message The IPCMessage that is received. Can be of subtypes IPCRequest or IPCReply.
     */
    public onMessage(message: IPCMessage): void {
        console.log('Interval worker message received');

        if(message.type == IPCMessage.TYPE_REQUEST) {
            let m: IPCRequest = <IPCRequest>message;

            //While this requires more manual work than working with an eval() statement. It is much much safer.
            switch (m.targetFunction) {
                case 'restart':
                    this.restart();
                    break;
                case 'broadcastMessage':
                    console.log('Broadcast of message: ' + m.payload + ' requested!');
                    this.broadcastMessage(m.payload);
                    break;
                default:
                    console.log('[WORKER id:' + this.workerId + '] No valid target handler found!');
            }
        }

        MessageManager.getInstance().sendReply(null, <IPCRequest>message);
    }
}
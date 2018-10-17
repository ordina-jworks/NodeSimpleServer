import { Scenario } from "../../scenario";
import { Board, Led } from "johnny-five";

/**
 * BlinkScenario class that implements the Scenario interface.
 */
export class BlinkScenario implements Scenario {

    public run = (board: Board): void => {
        let led: Led = new Led(13);
        led.blink(500);
    };

    public onMessage = (message: any): void => {
        console.log('Message received: ' + message);
    };
}
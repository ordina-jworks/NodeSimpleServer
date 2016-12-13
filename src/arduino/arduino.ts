import {Scenario} from "./scenario";

/**
 * Arduino base class.
 * Other Arduino implementations should extend this class.
 */
export abstract class Arduino {

    protected scenario: Scenario = null;

    /**
     * Method to initialise the Arduino implementation.
     */
    abstract init(): void;

    /**
     * Method to clean up the Arduino implementation.
     */
    abstract cleanup(): void;

    /**
     * If a message is received from the Arduino it is relayed to the scenario (if any).
     *
     * @param message The message to formward to the Arduino scenario.
     */
    public onMessage = (message: any): void => {
        if(this.scenario != null) {
            this.scenario.onMessage(message);
        }
    };
}
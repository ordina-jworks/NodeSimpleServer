import {Scenario} from "./scenario";

export abstract class Arduino {

    protected scenario: Scenario = null;

    abstract init(): void;

    public onMessage = (message: any): void => {
        if(this.scenario != null) {
            this.scenario.onMessage(message);
        }
    };
}
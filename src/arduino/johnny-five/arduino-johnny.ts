import johnny = require('johnny-five');

import {Arduino}    from "../arduino";
import {Board}      from "johnny-five";
import {Scenario}   from "../scenario";

export class ArduinoJohnny extends Arduino {

    private board: Board            = null;

    constructor(scenario: Scenario) {
        super();
        this.scenario = scenario;
    }

    public init(): void {
        if(this.board == null) {
            this.board = new Board();
            this.board.on('ready', this.onBoardReady);
        } else {
            console.log('Board already initialised!');
        }
    };

    private onBoardReady = () => {
        console.log('Board initialised!');

        if(this.scenario != null) {
            this.scenario.run(this.board);
        } else {
            console.error('No arduino scenario given to run!');
        }
    };
}
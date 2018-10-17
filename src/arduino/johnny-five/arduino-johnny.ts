import { Arduino } from "../arduino";
import { Board } from "johnny-five";
import { Scenario } from "../scenario";

/**
 * ArduinoJohnny class.
 *
 * Extends the basic Arduino class and interfaces with the Arduino via the Johnny-Five framework.
 */
export class ArduinoJohnny extends Arduino {

    private board: Board = null;

    /**
     * Constructor for ArduinoJohnny
     * @param scenario The Scenario instance that should be executed.
     */
    constructor(scenario: Scenario) {
        super();
        this.scenario = scenario;
    }

    /**
     * This method initialises the Johnny-Five Board.
     */
    public init(): void {
        if (this.board == null) {
            this.board = new Board();
            this.board.on('ready', this.onBoardReady);
        } else {
            console.log('Board already initialised!');
        }
    }

    /**
     * Closes and cleans up the connection to the board.
     */
    public cleanup(): void {
        //TODO: Find a way to close the connection to the board from our end!
    }

    /**
     * Handler method that is called when the Board is ready and runs the scenario (if any).
     */
    private onBoardReady = () => {
        console.log('Board initialised!');

        if (this.scenario != null) {
            this.scenario.run(this.board);
        } else {
            console.error('No arduino scenario given to run!');
        }
    };
}
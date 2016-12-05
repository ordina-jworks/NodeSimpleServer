export class Config {

    private static instance: Config;

    //Config variables:
    public settings = {
        httpPort:                       7080,
        socketPort:                     7081,

        webContentFolder:               "www",
        allowFolderListing:             true
    };

    public keys = {
        proximusOwner:                  "",
        proximusBearerToken:            ""
    };

    public arduino = {
        enableArduinoFunctionality:     false,
        enableNativeArduinoSerial:      true,

        nativeArduinoPortName:          "usbmodem",
        nativeActiveImplementation:     null,
        nativeImplementations:          null,

        activeImplementation:           null,
        implementations:                null
    };

    private constructor() {
        this.init();
    }

    static getInstance = (): Config => {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    };

    private init = (): void => {
        this.arduino.nativeImplementations =  {
            jaxLondon:      "ArduinoSerialJaxLondon",
            sensy:          "ArduinoSerialSensy"
        };
        this.arduino.nativeActiveImplementation = this.arduino.nativeImplementations.jaxLondon;


        this.arduino.implementations = {
            slotMachine:    "ArduinoSlotMachine",
            jaxLondon:      "ArduinoJaxLondon"
        };
        this.arduino.activeImplementation = this.arduino.implementations.jaxLondon;
    };
}
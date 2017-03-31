export class Config {

    private static instance: Config;

    //Config variables:
    public settings = {
        httpPort:                       7080,
        socketPort:                     7081,

        webContentFolder:               "www",
        allowFolderListing:             true,

        intervalTimeoutInSeconds:       480,

        defaultCacheSize:               250
    };

    public keys = {
    };

    public arduino = {
        enableArduino:                  false,

        useSerialOverJohnnyFive:        false,
        serialPortName:                 "usbmodem",
        serialPortBaudRate:             57600
    };

    private constructor() {
        //Empty private constructor.
    }

    static getInstance = (): Config => {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    };
}
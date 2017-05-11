export class Config {

    private static instance: Config;

    //Config variables:
    public settings = {
        httpPort:                       8080,
        socketPort:                     8081,

        webContentFolder:               "www",
        endpointScanFolder:             "src/web/endpoints/impl/",
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
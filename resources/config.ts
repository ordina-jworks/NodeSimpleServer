export class Config {

    private static instance: Config;

    //Config variables:
    public settings = {
        httpPort:                       8080,
        socketPort:                     8000,

        webContentFolder:               "www",
        endpointScanFolder:             "src/web/endpoints/impl/",
        allowFolderListing:             true,

        intervalTimeoutInSeconds:       480,

        defaultCacheSize:               250
    };

    public keys = {
        openweatherMapApiKey:           'b2b52dcbabc90f4831af50770d3d5081'
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
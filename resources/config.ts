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

    public arduino = {
        enableArduino:                  false,

        useSerialOverJohnnyFive:        false,
        serialPortName:                 "usbmodem",
        serialPortBaudRate:             57600
    };

    public keys = {
    };

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //!!!!!!!! Do NOT use the standard users when deploying! For test purposes only !!!!!!!!!!!
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    public roles = {
        admin: 'admin',
        user: 'user'
    };
    public auth = {
      users: [
          {user: 'admin', auth: 'YWRtaW46YWRtaW4=', roles: [this.roles.admin, this.roles.user]},
          {user: 'user',  auth: 'dXNlcjp1c2Vy',     roles: [this.roles.user]}
      ]
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
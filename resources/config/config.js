"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor() {
        //Config variables:
        this.settings = {
            httpPort: 8080,
            socketPort: 8000,
            webContentFolder: "www",
            endpointScanFolder: "src/web/endpoints/impl/",
            allowFolderListing: true,
            intervalTimeoutInSeconds: 480,
            defaultCacheSize: 250
        };
        this.arduino = {
            enableArduino: false,
            useSerialOverJohnnyFive: false,
            serialPortName: "usbmodem",
            serialPortBaudRate: 57600
        };
        this.keys = {};
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!! Do NOT use the standard users when deploying! For test purposes only !!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.roles = {
            admin: 'admin',
            user: 'user'
        };
        this.auth = {
            users: [
                { user: 'admin', auth: 'YWRtaW46YWRtaW4=', roles: [this.roles.admin, this.roles.user] },
                { user: 'user', auth: 'dXNlcjp1c2Vy', roles: [this.roles.user] }
            ]
        };
        //Empty private constructor.
    }
}
Config.getInstance = () => {
    if (!Config.instance) {
        Config.instance = new Config();
    }
    return Config.instance;
};
exports.Config = Config;
//# sourceMappingURL=config.js.map
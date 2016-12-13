export abstract class IPCMessage {

    public static TYPE_REQUEST: string      = "TYPE_REQUEST";
    public static TYPE_REPLY: string        = "TYPE_REPLY";

    public workerId: string     = null;
    public type: string         = null;
    public payload: any         = null;

    constructor(type: string) {
        this.type = type;
    }
}
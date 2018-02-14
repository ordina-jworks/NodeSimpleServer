/**
 * Abstract IPCMessage base class.
 *
 * All implementations should extend this class.
 */
export abstract class IPCMessage {

    public static TYPE_REQUEST: string      = "TYPE_REQUEST";
    public static TYPE_REPLY: string        = "TYPE_REPLY";

    public workerId: number     = null;
    public type: string         = null;
    public payload: any         = null;

    /**
     * Base class constructor.
     * The type given defines each instance as a specific type since type checking at runtime does not work with actual classes.
     *
     * @param type The type of the IPCMessage. Use the static values provided in the base class.
     */
    constructor(type: string) {
        this.type = type;
    }
}
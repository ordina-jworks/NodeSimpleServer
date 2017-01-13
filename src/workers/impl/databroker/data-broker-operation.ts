/**
 * Enum that contains the different operations that are supported by the DataBroker.
 */
export enum DataBrokerOperation {
    RETRIEVE        = 1,
    SAVE            = 2,
    UPDATE          = 3,
    DELETE          = 4,
    RETRIEVE_CACHE  = 5,
    CREATE_CACHE    = 6,
    DELETE_CACHE    = 7
}
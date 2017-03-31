/**
 * Enum that contains the different operations that are supported by the DataBroker.
 */
export enum DataBrokerOperation {
    RETRIEVE        = 1,
    SAVE            = 2,
    UPDATE          = 3,
    DELETE          = 4,
    RETRIEVE_CACHES = 5,
    RETRIEVE_CACHE  = 6,
    CREATE_CACHE    = 7,
    DELETE_CACHE    = 8
}
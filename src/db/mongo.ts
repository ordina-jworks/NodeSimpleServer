/**
 * Created by ToVB on 8/02/2017.
 */
import {Mongoose} from "mongoose";

export class Mongo {
    private static mongoose: Mongoose;

    public static getConnection() {
        if (!Mongo.mongoose) {
            //create the DB connection
            Mongo.mongoose = new Mongoose().connect('mongodb://localhost/mysense-helmet');
        }

        return Mongo.mongoose;
    }
}
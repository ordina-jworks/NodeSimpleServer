/**
 * Created by ToVB on 8/02/2017.
 */
import {Mongoose} from "mongoose";

export class Mongo {
    private static mongoose: Mongoose;

    public static getConnection() {
        if (!Mongo.mongoose) {
            //create the DB connection
            let dbUrl = 'mongodb://localhost/mysense-helmet'
            if (process.env.VCAP_SERVICES) {
                let cfConfig = JSON.parse(process.env.VCAP_SERVICES);
                dbUrl = cfConfig.mlab[0].credentials.uri + '/mysense-helmet';
            }

            Mongo.mongoose = new Mongoose().connect(dbUrl);
        }

        return Mongo.mongoose;
    }
}
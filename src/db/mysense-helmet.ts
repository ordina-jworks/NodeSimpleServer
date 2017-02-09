import {Schema} from "mongoose";
import {Model, Document} from "mongoose";
import {Mongo} from "./mongo";
import {Promise} from "es6-promise";
/**
 * Created by ToVB on 8/02/2017.
 */

export class MySenseHelmetDB {
    private static _schema: Schema;
    private static _model: Model <Document>;

    constructor() {
        if (!MySenseHelmetDB._schema) {
            MySenseHelmetDB._schema = new Schema({
                sensorAddress: String,
                subscriptions: [String]
            }).pre('save', function (next) {
                this.updated = new Date();
                next();
            });
        }

        if(!MySenseHelmetDB._model) MySenseHelmetDB._model = Mongo.getConnection().model('MySenseHelmetDB', MySenseHelmetDB._schema);
    }

    public addSubscription(sensorAddress: string, deviceToken: string): Promise<any> {
        console.log("addSubscription '" + sensorAddress + "' - '" + deviceToken + "'");
        return new Promise<any>((resolve, reject) =>{
            this.getSensor(sensorAddress)
                .then(sensor => {
                    if (sensor) {
                        console.log("Sensor found: " + JSON.stringify(sensor));
                        // add device token

                        if (sensor.subscriptions.includes(deviceToken)) {
                            console.log('device token already registered');
                            return (resolve(sensor));
                        } else {
                            sensor.subscriptions.push(deviceToken);
                            return resolve(MySenseHelmetDB._model.update({sensorAddress: sensorAddress}, sensor));
                        }
                    } else {
                        console.log("Sensor not found => create it");
                        return resolve(MySenseHelmetDB._model.create({
                            sensorAddress: sensorAddress,
                            subscriptions: [deviceToken]
                        }).onResolve((err, sen) => {
                            err ? reject(err) : resolve(sen);
                        }));
                    }
                })
        });
    }

    public removeSubscription(sensorAddress: string, deviceToken: string): Promise<any> {
        console.log("removeSubscription '" + sensorAddress + "' - '" + deviceToken + "'");
        return new Promise<any>((resolve, reject) =>{
            this.getSensor(sensorAddress)
                .then(sensor => {
                    if (sensor) {
                        console.log("Sensor found: " + JSON.stringify(sensor));
                        // remove device token
                        sensor.subscriptions = sensor.subscriptions.filter(item => item !== deviceToken);
                        return resolve(MySenseHelmetDB._model.update({sensorAddress: sensorAddress}, sensor));

                    } else {
                        throw new Error('Sensor not found');
                    }
                })
        });
    }

    public clearSensor(sensorAddress: string): Promise<any> {
        console.log("removeSubscription '" + sensorAddress + "'");
        return new Promise<any>((resolve, reject) =>{
            this.getSensor(sensorAddress)
                .then(sensor => {
                    if (sensor) {
                        console.log("Sensor found: " + JSON.stringify(sensor));
                        // remove device token
                        sensor.subscriptions = [];
                        return resolve(MySenseHelmetDB._model.update({sensorAddress: sensorAddress}, sensor));

                    } else {
                        throw new Error('Sensor not found');
                    }
                })
        });
    }

    public getSensor(sensorAddress: string):Promise<any> {
        console.log("getSensor '" + sensorAddress + "'");
        return new Promise<any>((resolve, reject) => {
            MySenseHelmetDB._model
                .findOne({sensorAddress: sensorAddress})
                .exec()
                .onResolve((err, sensor) => {
                    err ? reject(err) : resolve(sensor);
                })
        });
    }

}
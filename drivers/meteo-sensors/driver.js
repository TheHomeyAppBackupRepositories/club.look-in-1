"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const httpRequest_1 = __importDefault(require("../../utilites/httpRequest"));
class MeteoSensorsDriver extends homey_1.default.Driver {
    async onInit() {
        this.log('Meteo Sensors Driver has been initialized');
    }
    async onPairListDevices() {
        const meteoSensors = [];
        try {
            const devicesArray = this.homey.env.LOOKinDevices;
            for (let device of devicesArray) {
                const IP = device.IP;
                let deviceInfo = JSON.parse(await (0, httpRequest_1.default)(IP, '/device'));
                let version = parseInt(deviceInfo.MRDC.slice(0, 2));
                if (version >= 2) {
                    meteoSensors.push({
                        name: `${device.ID} meteo sensors`,
                        data: {
                            id: deviceInfo.ID
                        },
                        store: {
                            ID: device.ID
                        }
                    });
                }
            }
            return meteoSensors;
        }
        catch {
            return [];
        }
    }
}
module.exports = MeteoSensorsDriver;
